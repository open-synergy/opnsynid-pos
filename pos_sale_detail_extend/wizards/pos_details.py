# -*- coding: utf-8 -*-
# Copyright 2019 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import models, api, SUPERUSER_ID
from lxml import etree


class PosDetails(models.TransientModel):
    _inherit = "pos.details"

    @api.model
    def fields_view_get(
        self, view_id=None, view_type="form", toolbar=False, submenu=False
    ):
        res = super(PosDetails, self).fields_view_get(
            view_id=view_id, view_type=view_type,
            toolbar=toolbar, submenu=submenu)
        doc = etree.XML(res['arch'])
        domain = []

        if self.env.user.id != SUPERUSER_ID:
            domain.append(("id", "in", [self.env.user.id]))

        if domain:
            for node in doc.xpath("//field[@name='user_ids']"):
                node.set("domain", str(domain))

        res["arch"] = etree.tostring(doc)
        return res
