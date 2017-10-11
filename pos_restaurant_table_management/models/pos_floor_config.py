# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosFloorConfig(models.Model):
    _name = "pos.floor_config"
    _description = "PoS Floor Config"

    pos_id = fields.Many2one(
        string="PoS",
        comodel_name="pos.config",
        required=True,
        )
    floor_id = fields.Many2one(
        string="Floor",
        comodel_name="pos.floor",
        required=True,
        )
