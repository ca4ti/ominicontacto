# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import logging as _logging

from django.http import JsonResponse
from django.views.generic import View

from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated

from api_app.serializers import CampanaSerializer, AgenteProfileSerializer
from api_app.utiles import EstadoAgentesService

from ominicontacto_app.models import Campana, AgenteProfile
from reportes_app.reportes.reporte_llamadas_supervision import (
    ReporteDeLLamadasEntrantesDeSupervision, ReporteDeLLamadasSalientesDeSupervision
)
from ominicontacto_app.services.asterisk.interaccion_supervisor_agente import (
    AccionesDeSupervisorSobreAgente
)

logger = _logging.getLogger(__name__)


class EsSupervisorPermiso(BasePermission):
    """Permiso para aplicar a vistas solo para supervisores"""

    def has_permission(self, request, view):
        super(EsSupervisorPermiso, self).has_permission(request, view)
        superv_profile = request.user.get_supervisor_profile()
        return superv_profile is not None


class EsAdminPermiso(BasePermission):
    """Permiso para aplicar a vistas solo para administradores"""

    def has_permission(self, request, view):
        super(EsAdminPermiso, self).has_permission(request, view)
        return request.user.get_is_administrador()


class SupervisorCampanasActivasViewSet(viewsets.ModelViewSet):
    """Servicio que devuelve las campañas activas relacionadas a un supervisor
    si este no es admin y todas las campañas activas en el caso de sí lo sea
    """
    serializer_class = CampanaSerializer
    permission_classes = (IsAuthenticated, EsSupervisorPermiso,)
    queryset = Campana.objects.obtener_activas()

    def get_queryset(self):
        superv_profile = self.request.user.get_supervisor_profile()
        if superv_profile.is_administrador:
            return super(SupervisorCampanasActivasViewSet, self).get_queryset()
        return superv_profile.obtener_campanas_activas_asignadas()


class AgentesActivosGrupoViewSet(viewsets.ModelViewSet):
    """Servicio que devuelve las agentes activos de un grupo
    """
    serializer_class = AgenteProfileSerializer
    permission_classes = (IsAuthenticated, EsAdminPermiso,)

    def get_queryset(self):
        queryset = AgenteProfile.objects.obtener_activos()
        grupo_pk = self.kwargs.get('pk_grupo')
        queryset = queryset.filter(grupo__pk=grupo_pk)
        return queryset


class StatusCampanasEntrantesView(View):
    def get(self, request):
        reporte = ReporteDeLLamadasEntrantesDeSupervision(request.user)
        return JsonResponse({'errors': None,
                             'data': reporte.estadisticas})


class StatusCampanasSalientesView(View):
    def get(self, request):
        reporte = ReporteDeLLamadasSalientesDeSupervision(request.user)
        return JsonResponse({'errors': None,
                             'data': reporte.estadisticas})


class AgentesStatusAPIView(View):
    """Devuelve información de los agentes en el sistema"""

    def get(self, request):
        agentes_activos_service = EstadoAgentesService()
        data = list(agentes_activos_service._obtener_agentes_activos_ami())
        return JsonResponse(data=data, safe=False)


class InteraccionDeSupervisorSobreAgenteView(View):

    def dispatch(self, request, *args, **kwargs):
        self.supervisor = self.request.user.get_supervisor_profile()
        self.agente_id = kwargs.get('pk')
        # TODO: Verificar que el supervisor sea responsable del agente.
        return super(InteraccionDeSupervisorSobreAgenteView, self).dispatch(
            request, *args, **kwargs)

    def post(self, request, pk):
        accion = request.POST.get('accion')
        servicio_acciones = AccionesDeSupervisorSobreAgente()
        error = servicio_acciones.ejecutar_accion(self.supervisor, self.agente_id, accion)
        if error:
            return JsonResponse(data={
                'status': 'ERROR',
                'message': error
            })
        else:
            return JsonResponse(data={
                'status': 'OK',
            })
