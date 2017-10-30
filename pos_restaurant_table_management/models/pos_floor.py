# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosFloor(models.Model):
    _name = "pos.floor"
    _description = "Restaurant Floor"

    name = fields.Char(
        string="Name",
        required=True,
        )
    floor_name = fields.Char(
        string="Floor Name",
        required=True,
        )
    config_ids = fields.Many2many(
        string="PoS Configs",
        comodel_name="pos.config",
        relation="pos_config_floor_rel",
        column1="floor_id",
        column2="config_id"
    )
    table_ids = fields.One2many(
        string="Tables",
        comodel_name="pos.table",
        inverse_name="floor_id",
        )
