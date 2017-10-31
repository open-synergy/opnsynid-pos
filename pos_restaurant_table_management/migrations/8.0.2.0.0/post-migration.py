# -*- coding: utf-8 -*-
# Copyright 2017 OpenSynergy Indonesia
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import SUPERUSER_ID
from openerp.api import Environment


def migrate(cr, version):
    if not version:
        return

    env = Environment(cr, SUPERUSER_ID, {})
    obj_floor = env['pos.floor']
    floor_ids = obj_floor.search([])
    for floor in floor_ids:
        cr.execute('UPDATE pos_floor '
                   'SET floor_name = \'%s\' '
                   'WHERE id = %d;' %
                   (floor.name, floor))

    obj_table = env['pos.table']
    table_ids = obj_table.search([])
    for table in table_ids:
        cr.execute('UPDATE pos_table '
                   'SET table_name = \'%s\' '
                   'WHERE id = %d;' %
                   (table.name, table))

    cr.execute("""
        INSERT INTO pos_config_floor_rel(floor_id, config_id)
        SELECT A.id, A.pos_config_id
        FROM pos_floor AS A
        """)

    cr.execute("""
        DELETE FROM ir_model_data
        WHERE   name = 'field_pos_config_id' AND
                module = 'pos.floor' AND
                model = 'ir.model.fields'
        """)

    cr.execute("""
        DELETE FROM ir_model_fields AS a
        USING    ir_model AS b
        WHERE   a.name = 'pos_config_id' AND
                b.name = 'ois.floor' AND
                a.model_id = b.id
        """)

    cr.execute("""
        ALTER TABLE pos_floor
            DROP COLUMN IF EXISTS pos_config_id
            """)
