# -*- coding: utf-8 -*-
# Copyright 2018 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
# pylint: disable=locally-disabled, manifest-required-author
{
    "name": "PoS - Disable Product Grouping",
    "version": "8.0.1.0.1",
    "website": "https://opensynergy-indonesia.com",
    "author": "OpenSynergy Indonesia",
    "license": "AGPL-3",
    "installable": True,
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "views/product_template_views.xml",
        "pos_disable_product_grouping.xml",
    ],
    "qweb": [
    ],
}
