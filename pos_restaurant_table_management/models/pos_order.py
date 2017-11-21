# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosOrder(models.Model):
    _inherit = "pos.order"

    table_id = fields.Many2one(
        string="Table",
        comodel_name="pos.table",
        )
    guest = fields.Integer(
        string="Guest"
    )

    def _order_fields(self, cr, uid, ui_order, context=None):
        res = super(PosOrder, self)._order_fields(
            cr, uid, ui_order, context=context
        )
        if "table" in ui_order:
            res['table_id'] = ui_order['table']['id']
        if "guest" in ui_order:
            res['guest'] = ui_order['guest']
        return res
