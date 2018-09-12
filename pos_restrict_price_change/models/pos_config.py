# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import models, fields, api


class PosConfig(models.Model):
    _inherit = "pos.config"

    @api.depends(
        "allowed_group_change_price_ids",
        "allowed_user_change_price_ids")
    def _compute_all_user_change_price_ids(self):
        obj_res_users = self.env["res.users"]
        for config in self:
            users = config.allowed_user_change_price_ids
            group_ids = config.allowed_group_change_price_ids.ids
            criteria = [
                ("groups_id", "in", group_ids)
            ]
            users += obj_res_users.search(criteria)
            config.all_user_change_price_ids = users

    restrict_price_change = fields.Boolean(
        string="Restrict Price Change",
    )
    allowed_group_change_price_ids = fields.Many2many(
        string="Allowed Groups to Change Price",
        comodel_name="res.groups",
        relation="relation_config_2_groups_change_price",
        column1="config_id",
        column2="group_change_price_id",
    )
    allowed_user_change_price_ids = fields.Many2many(
        string="Allowed Users to Change Price",
        comodel_name="res.users",
        relation="relation_config_2_users_change_price",
        column1="config_id",
        column2="user_change_price_id",
    )
    all_user_change_price_ids = fields.Many2many(
        string="All Allowed Users for Change Price",
        comodel_name="res.users",
        compute="_compute_all_user_change_price_ids",
        store=True,
    )
