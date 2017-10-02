# -*- coding: utf-8 -*-
# 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import models, fields, api


class PosConfig(models.Model):
    _inherit = "pos.config"

    @api.depends(
        "allowed_product_categ_ids",
        "allowed_product_ids",
        "allowed_product_ids.sale_ok")
    def _compute_all_allowed_product_ids(self):
        obj_product = self.env["product.product"]
        for config in self:
            products = config.allowed_product_ids
            category_ids = config.allowed_product_categ_ids.ids
            criteria = [
                ("categ_id", "in", category_ids),
                ("sale_ok", "=", True),
                ("available_in_pos", "=", True)
            ]
            products += obj_product.search(criteria)
            config.all_allowed_product_ids = products

    limit_product_selection = fields.Boolean(
        string="Limit Product Selection",
    )
    allowed_product_categ_ids = fields.Many2many(
        string="Allowed Product Categories",
        comodel_name="product.category",
        relation="rel_config_2_product_categ",
        column1="config_id",
        column2="product_categ_id",
    )
    allowed_product_ids = fields.Many2many(
        string="Allowed Product",
        comodel_name="product.product",
        domain=[
            ("sale_ok", "=", True),
            ("available_in_pos", "=", True)
        ],
        relation="rel_config_2_product",
        col1="config_id",
        col2="product_id",
    )
    all_allowed_product_ids = fields.Many2many(
        string="Allowed Product",
        comodel_name="product.product",
        compute="_compute_all_allowed_product_ids",
        store=True,
    )
