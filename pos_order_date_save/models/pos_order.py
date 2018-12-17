# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models


class PosOrder(models.Model):
    _inherit = "pos.order"

    def _order_fields(self, cr, uid, ui_order, context=None):
        res = super(PosOrder, self)._order_fields(
            cr, uid, ui_order, context=context
        )
        if "date_order" in ui_order:
            res['date_order'] = ui_order['date_order']
        return res
