# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields
from openerp import tools
import openerp.addons.decimal_precision as dp


class PosOrderSummaryByTransaction(models.AbstractModel):
    _name = "pos.order_summary_by_transaction"
    _auto = False

    date_order = fields.Date(
        string="Order Date"
    )
    pos_reference = fields.Char(
        string="Receipt Ref."
    )
    product_id = fields.Many2one(
        string="Product",
        comodel_name="product.product",
    )
    warehouse_id = fields.Many2one(
        string="Warehouse",
        comodel_name="stock.warehouse"
    )
    price_unit = fields.Float(
        string="Unit Price",
        digits_compute=dp.get_precision('Product Price')
    )
    discount = fields.Float(
        string="Discount",
        digits_compute=dp.get_precision('Account')
    )
    qty = fields.Float(
        string="Qty",
        digits_compute=dp.get_precision('Product UoS')
    )
    price_subtotal = fields.Float(
        string="Subtotal",
        digits_compute=dp.get_precision('Product Price')
    )

    def _select(self):
        select_str = """
            SELECT
                row_number() OVER() AS id,
                (
                    B.date_order at time zone 'utc'
                    at time zone 'Asia/Jakarta'
                )::date AS date_order,
                B.pos_reference AS pos_reference,
                A.product_id AS product_id,
                E.warehouse_id AS warehouse_id,
                A.price_unit AS price_unit,
                (A.price_unit *(A.discount/100)) AS discount,
                A.qty AS qty,
                A.price_subtotal AS price_subtotal
        """
        return select_str

    def _from(self):
        from_str = """
            FROM pos_order_line A
        """
        return from_str

    def _join(self):
        join_str = """
            JOIN pos_order B ON A.order_id=B.id
            JOIN pos_session C ON B.session_id=C.id
            JOIN pos_config D ON C.config_id=D.id
            JOIN stock_picking_type E ON D.picking_type_id=E.id
        """
        return join_str

    def init(self, cr):
        tools.drop_view_if_exists(cr, self._table)
        cr.execute("""CREATE or REPLACE VIEW %s as (
            %s
            %s
            %s
            )""" % (
            self._table,
            self._select(),
            self._from(),
            self._join()))
