# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields
from openerp import tools
import openerp.addons.decimal_precision as dp


class PosOrderSummaryByProduct(models.AbstractModel):
    _name = "pos.order_summary_by_product"
    _auto = False

    date_order = fields.Date(
        string="Order Date"
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
    total_discount = fields.Float(
        string="Total Discount",
        digits_compute=dp.get_precision('Account')
    )
    total_qty = fields.Float(
        string="Total Qty",
        digits_compute=dp.get_precision('Product UoS')
    )
    total_price = fields.Float(
        string="Total Price",
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
                A.product_id AS product_id,
                E.warehouse_id,
                A.price_unit AS price_unit,
                SUM((A.price_unit *(A.discount/100))) AS total_discount,
                SUM(A.qty) AS total_qty,
                SUM(A.price_subtotal) AS total_price
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

    def _group_by(self):
        group_by_str = """
            GROUP BY (
                B.date_order at time zone 'utc'at time zone 'Asia/Jakarta'
            )::date,A.product_id,E.warehouse_id,A.price_unit
        """
        return group_by_str

    def init(self, cr):
        tools.drop_view_if_exists(cr, self._table)
        cr.execute("""CREATE or REPLACE VIEW %s as (
            %s
            %s
            %s
            %s
            )""" % (
            self._table,
            self._select(),
            self._from(),
            self._join(),
            self._group_by()))
