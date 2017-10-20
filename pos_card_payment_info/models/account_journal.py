# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import fields, models


class AccountJournal(models.Model):
    _inherit = 'account.journal'

    payment_bank_ids = fields.Many2many(
        string="Payment Bank",
        comodel_name="pos.payment_bank",
        relation="rel_account_journal_2_pos_payment_bank",
        column1="journal_id",
        column2="pos_payment_bank_id"
    )
