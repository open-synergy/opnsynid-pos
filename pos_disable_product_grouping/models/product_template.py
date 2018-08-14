# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class ProductTemplate(models.Model):
    _inherit = "product.template"

    pos_grouping_ok = fields.Boolean(
        string="Group Product on PoS",
        default=True,
    )
