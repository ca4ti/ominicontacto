var tabagt;
$(function () {
  tabagt = $('#tableAgt').DataTable({
    createdRow: function (row, data, dataIndex) {
      if (data.estado === "READY") {
        $(row).css("background-color", "rgb(164, 235, 143)");
      } else if (data.estado === "ONCALL") {
        $(row).css("background-color", "rgb(44, 169, 231)");
      } else if (data.estado === "DIALING") {
        $(row).css("background-color", "rgb(249, 224, 60)");
      } else {//esta en pausa
        $(row).css("background-color", "rgb(249, 159, 157)");
      }
    },
    columns: [
        {data: 'agente'},
        {data: 'estado'},
        {data: 'tiempo'},
        {data: 'acciones'},
    ],
    ordering: false,
    searching: false,
    bLengthChange: false,
    paging: false
  });
  var url = window.location.href;
  if(url.indexOf('Detalle_Campana') !== -1) {
    setInterval("actualiza_contenido_agt()", 4000);
    setInterval("actualiza_contenido_camp()", 4000);
    setInterval("actualiza_contenido_colas()", 4000);
    setInterval("actualiza_contenido_wombat()", 4000);
  }
});

function actualiza_contenido_agt() {
  var nomcamp = $("#nombreCamp").html();
  $.ajax({
    url: 'Controller/Detalle_Campana_Contenido.php',
    type: 'GET',
    dataType: 'html',
    data: 'nomcamp='+nomcamp+'&op=agstatus',
    success: function (msg) {
      if(msg!=="]") {
        var mje = JSON.parse(msg);
        tabagt.rows().remove().draw();
        tabagt.rows.add(mje).draw();
      } else {
        tabagt.rows().remove().draw();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });
}


function actualiza_contenido_camp() {
  var nomcamp = $("#nombreCamp").html();
  var campid = $("#campId").val();
  var tabla = document.getElementById('bodyTableCampSummary');
  $.ajax({
    url: 'https://' + OmlIp + ':' + OmlPort + '/api_supervision/llamadas_campana/' + campid + '/',
    type: 'GET',
    dataType: 'html',
    success: function (msg) {
      $("#bodyScore").html("");
      var mje = $.parseJSON(msg), trHTML = '';
      $.each (mje, function (i, item) {
        if (i !== 'status') {
          trHTML += '<tr><td>' + i + '</td><td>' + item + '</td></tr>';
        }
      });
      $("#bodyScore").append(trHTML);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });
  $.ajax({
    url: 'https://' + OmlIp + ':' + OmlPort + '/api_supervision/calificaciones_campana/'+ campid + '/',
    type: 'GET',
    dataType: 'html',
    success: function (msg) {
      $("#bodySummary").html("");
      var mje = $.parseJSON(msg), trHTML = '';
      $.each (mje, function (i, item) {
        if (i !== 'status') {
          trHTML += '<tr><td>' + i + '</td><td>' + item + '</td></tr>';
        }
      });
      $("#bodySummary").append(trHTML);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });
}

function actualiza_contenido_colas() {
  var nomcamp = $("#nombreCamp").html();
  $.ajax({
    url: 'Controller/Detalle_Campana_Contenido.php',
    type: 'GET',
    dataType: 'html',
    data: 'nomcamp='+nomcamp+'&op=queuedcalls',
    success: function (msg) {
      if(msg!=="]") {
        var mje = JSON.parse(msg);
        var tabla = document.getElementById('tableQueuedCalls');
        if($("#tableQueuedCalls").children().length > 0) {
          while(tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
          }
        }
        for (var i = 0; i < mje.length; i++) {
          var tdTimeContainer = document.createElement('td');
          var tdTimeLabel = document.createElement('td');
          var rowTime = document.createElement('tr');

          var textTimeContainer = document.createTextNode(mje[i].nroLlam);
          var textTimeLabel = document.createTextNode(mje[i].tiempo);

          tdTimeContainer.appendChild(textTimeContainer);
          tdTimeLabel.appendChild(textTimeLabel);
          rowTime.appendChild(tdTimeLabel);
          rowTime.appendChild(tdTimeContainer);
          tabla.appendChild(rowTime);
        }
      } else {
        var tabla = document.getElementById('tableQueuedCalls');
        if($("#tableQueuedCalls").children().length > 0) {
          while(tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
          }
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });
}

function actualiza_contenido_wombat() {
  var nomcamp = $("#nombreCamp").html();
  $.ajax({
    url: 'Controller/Detalle_Campana_Contenido.php',
    type: 'GET',
    dataType: 'html',
    data: 'nomcamp='+nomcamp+'&op=wdstatus',
    success: function (msg) {
      if(msg!=="]") {
        var mje = JSON.parse(msg);
        var tabla = document.getElementById('tableChannelsWombat');
        if($("#tableChannelsWombat").children().length > 0) {
          while(tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
          }
        }
        for (var i = 0; i < mje.length; i++) {
          var tdStatContainer = document.createElement('td');
          var tdTelContainer = document.createElement('td');
          var row = document.createElement('tr');

          var textStatContainer = document.createTextNode(mje[i].estado);
          var textTelContainer = document.createTextNode(mje[i].numero);

          tdTelContainer.appendChild(textTelContainer);
          tdStatContainer.appendChild(textStatContainer);
          row.appendChild(tdStatContainer);
          row.appendChild(tdTelContainer);
          tabla.appendChild(row);
        }
      } else {
        var tabla = document.getElementById('tableChannelsWombat');
        if($("#tableChannelsWombat").children().length > 0) {
          while(tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
          }
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error al ejecutar => " + textStatus + " - " + errorThrown);
    }
  });
}
