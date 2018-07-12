# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, models, fields
import openerp.addons.decimal_precision as dp


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    @api.multi
    @api.depends(
        "product_id.taxes_id",
        "price_unit",
        "discount",
        "product_id",
        "order_id.partner_id",
        "company_id",
        "order_id.company_id"
    )
    def _amount_line_all(self):
        for line in self:
            price = line.price_unit * (1 - (line.discount or 0.0) / 100.0)

            if line.product_id.pos_tax_ids:
                taxes_ids = line.product_id.pos_tax_ids
            else:
                taxes_ids = line.product_id.taxes_id

            taxes = taxes_ids.compute_all(
                price, line.qty,
                product=line.product_id,
                partner=line.order_id.partner_id
            )
            line.price_subtotal = taxes["total"]
            line.price_subtotal_incl = taxes["total_included"]

    price_subtotal = fields.Float(
        string="Subtotal w/o Tax",
        digits=dp.get_precision("Product Price"),
        compute=_amount_line_all,
        store=True
    )

    price_subtotal_incl = fields.Float(
        string="Subtotal",
        digits=dp.get_precision("Account"),
        compute=_amount_line_all,
        store=True
    )

    def onchange_qty(
        self, cr, uid, ids, product,
        discount, qty, price_unit, context=None
    ):
        result = {}
        if not product:
            return result
        account_tax_obj = self.pool.get("account.tax")

        prod = self.pool.get("product.product").browse(
            cr, uid, product, context=context)

        price = price_unit * (1 - (discount or 0.0) / 100.0)

        if prod.pos_tax_ids:
            taxes_ids = prod.pos_tax_ids
        else:
            taxes_ids = prod.taxes_id

        taxes = account_tax_obj.compute_all(
            cr, uid, taxes_ids, price, qty, product=prod, partner=False)

        result["price_subtotal"] = taxes["total"]
        result["price_subtotal_incl"] = taxes["total_included"]
        return {"value": result}
