# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import fields, models


class AccountBankStatementLine(models.Model):
    _inherit = 'account.bank.statement.line'

    pos_card_payment_info = fields.Char(
        string='#Payment Ref',
        index=True
    )

    pos_payment_bank_id = fields.Many2one(
        string="Electronic Payment",
        comodel_name="pos.payment_bank"
    )
