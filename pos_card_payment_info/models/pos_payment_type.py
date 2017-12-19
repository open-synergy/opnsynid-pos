# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class PosPaymentType(models.Model):
    _name = "pos.payment.type"
    _description = "Type of Payment"

    name = fields.Char(
        string="Name",
        required=True
    )
    description = fields.Text(
        string="Description"
    )
    active = fields.Boolean(
        string="Active",
        default=True
    )
