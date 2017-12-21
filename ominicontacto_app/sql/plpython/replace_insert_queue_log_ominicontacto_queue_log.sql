CREATE OR REPLACE FUNCTION insert_queue_log_ominicontacto_queue_log() returns trigger as $$import datetime
from plpy import spiexceptions

types_keys = ("IN", "DIALER", "saliente", "preview")
types_values = range(1, 5)

TYPES_NAMES_DICT = dict(zip(types_keys, types_values))

tiempo = TD['new']['time']
fecha = datetime.datetime.strptime(tiempo, '%Y-%m-%d %H:%M:%S.%f')
callid = TD['new']['callid']
queuename = TD['new']['queuename']
agent = TD['new']['agent']
event = TD['new']['event']
data1 = TD['new']['data1']
data2 = TD['new']['data2']
data3 = TD['new']['data3']
data4 = TD['new']['data4']
data5 = TYPES_NAMES_DICT.get(TD['new']['data4'], '')

plan = plpy.prepare("INSERT INTO ominicontacto_app_queuelog(time, callid, queuename, agent, event, data1, data2, data3, data4, data5, campana_id, agent_id) VALUES($1 ,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
["timestamp with time zone", "text", "text", "text", "text", "text", "text", "text", "text", "text", "int", "int"])
campana = queuename.split('_')
try:
    campana_id = int(campana[0])
except ValueError:
    campana_id = -1
agente = agent.split('_')
try:
    agente_id = int(agente[0])
except ValueError:
    agente_id = -1

plpy.execute(plan, [fecha, callid, queuename, agent, event, data1, data2, data3, data4, data5, campana_id, agente_id])
$$ language plpythonu;
