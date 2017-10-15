# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields, api, _


class StockWarehouse(models.Model):
    _inherit = "stock.warehouse"

    pos_type_id = fields.Many2one(
        string="PoS Type",
        comodel_name="stock.picking.type"
    )

    @api.multi
    def _prepare_pos_sequence(self):
        self.ensure_one()
        data = {
            "name": self.code + " - Consume",
            "prefix": self.code + "/POS/",
            "padding": 6
        }
        return data

    @api.multi
    def _prepare_pos_type(self):
        self.ensure_one()
        obj_sequence = self.env['ir.sequence']
        location = self.lot_stock_id

        sequence = obj_sequence.create(
            self._prepare_pos_sequence())

        data = {
            "name": _("PoS Order"),
            "warehouse_id": self.id,
            "sequence_id": sequence.id,
            "code": "outgoing",
            "default_location_src_id": location.id,
        }
        return data

    @api.multi
    def _create_pos_type(self):
        self.ensure_one()
        obj_type = self.env["stock.picking.type"]
        pos_type = obj_type.create(
            self._prepare_pos_type())
        return pos_type

    @api.multi
    def button_create_pos_type(self):
        for wh in self:
            pos_type = wh._create_pos_type()
            self.pos_type_id = pos_type.id
