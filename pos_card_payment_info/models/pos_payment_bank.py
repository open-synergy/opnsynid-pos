# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosPaymentBank(models.Model):
    _name = "pos.payment_bank"
    _description = "PoS Payment Bank"

    name = fields.Char(
        string="Name",
        required=True,
        )
    payment_type_id = fields.Many2one(
        string="Payment Type",
        comodel_name="pos.payment.type",
        required=False,
        )
    card_issuer_id = fields.Many2one(
        string="Issuer",
        comodel_name="res.card_issuer",
        required=True,
        )
    active = fields.Boolean(
        string="Active",
        default=True
    )
