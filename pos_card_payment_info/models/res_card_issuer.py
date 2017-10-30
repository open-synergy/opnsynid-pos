# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class ResCardIssuer(models.Model):
    _name = "res.card_issuer"
    _description = "Card Issuer"

    name = fields.Char(
        string="Issuer",
        required=True,
        )
