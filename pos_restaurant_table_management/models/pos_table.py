# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosTable(models.Model):
    _name = "pos.table"
    _description = "Restaurant Table"

    name = fields.Char(
        string="Name",
        required=True,
        )
    table_name = fields.Char(
        string="Table Name",
        required=True,
        )
    floor_id = fields.Many2one(
        string="Floor",
        comodel_name="pos.floor",
        required=True,
        )
    capacity = fields.Integer(
        string="Capacity",
        )
    state = fields.Selection(
        string="State",
        selection=[
            ("available", "Available"),
            ("vacant", "Vacant"),
            ("reserved", "Reserved"),
            ],
        required=True,
        default="available",
        )
