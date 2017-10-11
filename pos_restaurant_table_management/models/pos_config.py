# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosConfig(models.Model):
    _inherit = "pos.config"

    floor_ids = fields.One2many(
        string="Floor",
        comodel_name="pos.floor",
        inverse_name="pos_config_id",
        )
    iface_floorplan = fields.Boolean(
        string='Floor Plan',
        help='Enable Floor and Tables in the Point of Sale'
    )
