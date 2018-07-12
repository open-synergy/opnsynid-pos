# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, _
from openerp.exceptions import except_orm


class PosOrder(models.Model):
    _inherit = "pos.order"

    def _amount_line_tax(self, cr, uid, line, context=None):
        account_tax_obj = self.pool["account.tax"]
        lst_taxes = []

        if line.product_id.pos_tax_ids:
            taxes_ids = line.product_id.pos_tax_ids
        else:
            taxes_ids = line.product_id.taxes_id

        for tax in taxes_ids:
            if tax.company_id.id == line.order_id.company_id.id:
                lst_taxes.append(tax)
        price = line.price_unit * (1 - (line.discount or 0.0) / 100.0)
        taxes = account_tax_obj.compute_all(
            cr, uid, lst_taxes, price, line.qty,
            product=line.product_id,
            partner=line.order_id.partner_id or False
        )["taxes"]
        val = 0.0
        for c in taxes:
            val += c.get("amount", 0.0)
        return val

    def action_invoice(self, cr, uid, ids, context=None):
        inv_ref = self.pool.get("account.invoice")
        inv_line_ref = self.pool.get("account.invoice.line")
        product_obj = self.pool.get("product.product")
        pos_order_obj = self.pool.get("pos.order")
        inv_ids = []

        for order in pos_order_obj.browse(cr, uid, ids, context=context):
            if order.invoice_id:
                inv_ids.append(order.invoice_id.id)
                continue

            if not order.partner_id:
                raise except_orm(_("Error!"), _(
                    "Please provide a partner for the sale."
                ))

            acc = order.partner_id.property_account_receivable.id
            inv = {
                "name": order.name,
                "origin": order.name,
                "account_id": acc,
                "journal_id": order.sale_journal.id or None,
                "type": "out_invoice",
                "reference": order.name,
                "partner_id": order.partner_id.id,
                "comment": order.note or "",
                "currency_id": order.pricelist_id.currency_id.id,
            }
            inv.update(inv_ref.onchange_partner_id(
                cr, uid, [], "out_invoice",
                order.partner_id.id
            )["value"])

            inv.update({"fiscal_position": False})
            if not inv.get("account_id", None):
                inv["account_id"] = acc
            inv_id = inv_ref.create(cr, uid, inv, context=context)

            self.write(
                cr, uid, [order.id],
                {"invoice_id": inv_id, "state": "invoiced"}, context=context
            )
            inv_ids.append(inv_id)
            for line in order.lines:
                inv_line = {
                    "invoice_id": inv_id,
                    "product_id": line.product_id.id,
                    "quantity": line.qty,
                }
                inv_name = product_obj.name_get(
                    cr, uid, [line.product_id.id], context=context
                )[0][1]
                inv_line.update(
                    inv_line_ref.product_id_change(
                        cr, uid, [], line.product_id.id,
                        line.product_id.uom_id.id,
                        line.qty, partner_id=order.partner_id.id
                    )["value"]
                )
                if not inv_line.get("account_analytic_id", False):
                    inv_line["account_analytic_id"] = \
                        self._prepare_analytic_account(cr, uid, line,
                                                       context=context)
                inv_line["price_unit"] = line.price_unit
                inv_line["discount"] = line.discount
                inv_line["name"] = inv_name

                if line.product_id.pos_tax_ids:
                    taxes_ids = line.product_id.pos_tax_ids.ids
                else:
                    taxes_ids = line.product_id.taxes_id.ids

                inv_line["invoice_line_tax_id"] = [
                    (6, 0, taxes_ids)
                ]
                inv_line_ref.create(cr, uid, inv_line, context=context)
            inv_ref.button_reset_taxes(cr, uid, [inv_id], context=context)
            self.signal_workflow(cr, uid, [order.id], "invoice")
            inv_ref.signal_workflow(cr, uid, [inv_id], "validate")

        if not inv_ids:
            return {}

        mod_obj = self.pool.get("ir.model.data")
        res = mod_obj.get_object_reference(cr, uid, "account", "invoice_form")
        res_id = res and res[1] or False
        return {
            "name": _("Customer Invoice"),
            "view_type": "form",
            "view_mode": "form",
            "view_id": [res_id],
            "res_model": "account.invoice",
            "context": "{'type':'out_invoice'}",
            "type": "ir.actions.act_window",
            "nodestroy": True,
            "target": "current",
            "res_id": inv_ids and inv_ids[0] or False,
        }
