# -*- coding: utf-8 -*-
# Copyright 2019 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields
from openerp import tools


class PosOrderAnalysis(models.Model):
    _name = "pos.order_analysis"
    _description = "PoS Order Analysis"
    _auto = False
    _order = "date desc"

    date = fields.Datetime(
        string="Date Order",
        readonly=True,
    )
    session_id = fields.Many2one(
        string="Session",
        comodel_name="pos.session",
        readonly=True,
    )
    partner_id = fields.Many2one(
        string="Partner",
        comodel_name="res.partner",
        readonly=True,
    )
    product_id = fields.Many2one(
        string="Product",
        comodel_name="product.product",
        readonly=True,
    )
    state = fields.Selection(
        string="Status",
        selection=[
            ("draft", "New"),
            ("paid", "Closed"),
            ("done", "Synchronized"),
            ("invoiced", "Invoiced"),
            ("cancel", "Cancelled")],
    )
    user_id = fields.Many2one(
        string="Salesperson",
        comodel_name="res.users",
        readonly=True,
    )
    price_total = fields.Float(
        string="Total Price",
        readonly=True,
    )
    total_discount = fields.Float(
        string="Total Discount",
        readonly=True
    )
    average_price = fields.Float(
        string="Average Price",
        readonly=True,
        group_operator="avg",
    )
    location_id = fields.Many2one(
        string="Location",
        comodel_name="stock.location",
        readonly=True,
    )
    company_id = fields.Many2one(
        string="Company",
        comodel_name="res.company",
        readonly=True,
    )
    nbr = fields.Integer(
        string="# of Lines",
        readonly=True,
    )
    product_qty = fields.Integer(
        string="Product Quantity",
        readonly=True,
    )
    journal_id = fields.Many2one(
        string="Journal",
        comodel_name="account.journal",
    )
    delay_validation = fields.Integer(
        string="Delay Validation"
    )
    product_categ_id = fields.Many2one(
        string="Product Category",
        comodel_name="product.category",
        readonly=True
    )

    def _select(self):
        select_str = """
        SELECT
            MIN(A.id) AS id,
            COUNT(*) AS nbr,
            B.session_id AS session_id,
            B.date_order AS date,
            SUM(A.qty * E.factor) AS product_qty,
            SUM(A.qty * A.price_unit) AS price_total,
            SUM((A.qty * A.price_unit) * (A.discount / 100)) AS total_discount,
            (
                SUM(A.qty*A.price_unit) / SUM(A.qty * E.factor)
            )::decimal AS average_price,
            SUM(
                CAST(TO_CHAR(DATE_TRUNC('day',B.date_order) -
                DATE_TRUNC('day',B.create_date),'DD') AS int)
            ) AS delay_validation,
            B.partner_id AS partner_id,
            B.state AS state,
            B.user_id AS user_id,
            B.location_id AS location_id,
            B.company_id AS company_id,
            B.sale_journal AS journal_id,
            A.product_id AS product_id,
            D.categ_id AS product_categ_id
        """
        return select_str

    def _from(self):
        from_str = """
        pos_order_line as A
        """
        return from_str

    def _where(self):
        where_str = """
        WHERE 1 = 1
        """
        return where_str

    def _join(self):
        join_str = """
        LEFT JOIN pos_order AS B ON (B.id=A.order_id)
        LEFT JOIN product_product AS C on (C.id=A.product_id)
        LEFT JOIN product_template AS D on (D.id=C.product_tmpl_id)
        LEFT JOIN product_uom AS E on (E.id=D.uom_id)
        """
        return join_str

    def _group_by(self):
        group_str = """
        B.date_order,
        B.session_id,
        B.partner_id,
        B.state,
        D.categ_id,
        B.user_id,
        B.location_id,
        B.company_id,
        B.sale_journal,
        A.product_id,
        B.create_date
        """
        return group_str

    def _having(self):
        having_str = """
        SUM(A.qty * E.factor) != 0
        """
        return having_str

    def init(self, cr):
        tools.drop_view_if_exists(cr, self._table)
        # pylint: disable=locally-disabled, sql-injection
        cr.execute("""CREATE or REPLACE VIEW %s as (
            %s
            FROM %s
            %s
            %s
            GROUP BY %s
            HAVING %s
        )""" % (
            self._table,
            self._select(),
            self._from(),
            self._join(),
            self._where(),
            self._group_by(),
            self._having(),
        ))
