# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosFloor(models.Model):
    _name = "pos.floor"
    _description = "Restaurant Floor"

    name = fields.Char(
        string="Floor",
        required=True,
        )
    pos_config_id = fields.Many2one(
        string="PoS",
        comodel_name="pos.config",
        required=True,
        )
    table_ids = fields.One2many(
        string="Tables",
        comodel_name="pos.table",
        inverse_name="floor_id",
        )
