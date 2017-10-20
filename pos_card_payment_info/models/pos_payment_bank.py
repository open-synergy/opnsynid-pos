# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosPaymentBank(models.Model):
    _name = "pos.payment_bank"
    _description = "PoS Payment Bank"

    name = fields.Char(
        string="Bank",
        required=True,
        )
