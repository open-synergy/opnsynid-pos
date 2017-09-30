# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import fields, models


class AccountTax(models.Model):
    _inherit = 'account.tax'

    pos_tax_display_name = fields.Char(
        string='Display Name On POS',
        index=True)
