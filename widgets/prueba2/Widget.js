///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/toolbars/draw",
  "esri/graphic",
  "esri/graphicsUtils",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/Color",


  "esri/tasks/Geoprocessor",
  "esri/tasks/FeatureSet",
  "esri/tasks/LinearUnit",

  "dojo/ready",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/_base/lang", ],
  function (declare, BaseWidget, Draw, Graphic, graphicsUtils, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color,
    Geoprocessor, FeatureSet, LinearUnit,
    ready, parser, on, array, dom, lang, ) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function () {

        console.log('postCreate');
      },

      startup: function () {

        console.log('startup');
      },

      onOpen: function () {
        
        // var gpViewshed = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");
        // gpViewshed.outSpatialReference = this.map.spatialReference;
        // var tbDraw = new Draw(this.map);

        // tbDraw.activate(Draw.POINT);
        // tbDraw.on("draw-complete", calculateViewshed);
        // // function calculateViewshed(){}

        console.log('onOpen');

      },
      // comprueba : function (){

      //   var tbDraw = new Draw(this.map);
      //   tbDraw.activate(Draw.POINT);
      //   tbDraw.on("draw-complete", dibujarPunto)

      //   function dibujarPunto(evt) {

      //     this.map.graphics.clear();

      //     var punto = new SimpleMarkerSymbol();
      //     punto.setSize(12);
      //     punto.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1));
      //     punto.setColor(new Color([255, 0, 0]));

      //     var geometryPoint = evt.geometry;

      //     var puntaso = new Graphic(geometryPoint, punto);

      //     this.map.graphics.add(puntaso)

      //   }

      //   },
      


      comprueba: function () {
       
        var gpViewshed = new Geoprocessor("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed");
        gpViewshed.outSpatialReference = this.map.spatialReference;

        var tbDraw = new Draw(this.map);
        tbDraw.activate(Draw.POINT);
        tbDraw.on("draw-complete", calculateViewshed)
        
        function calculateViewshed(evt) {

          this.map.graphics.clear();

          var punto = new SimpleMarkerSymbol();
          punto.setSize(12);
          punto.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([132, 0, 168]), 1));
          punto.setColor(new Color([255, 0, 0]));

          var geometryPoint = evt.geometry;

          var graphicViewpoint = new Graphic(geometryPoint, punto);

          this.map.graphics.add(graphicViewpoint)

          var fsInputPoint = new FeatureSet();
          fsInputPoint.features.push(graphicViewpoint);

          var luDistance = new LinearUnit();
          luDistance.distance = dom.byId("jeje").value;
          luDistance.units = dom.byId("jiji").value;

          var gpParams = {
            "Input_Observation_Point": fsInputPoint,
            "Viewshed_Distance": luDistance
          };
          gpViewshed.execute(gpParams);
          gpViewshed.on("execute-complete", lang.hitch( this, 
            function(results, messages) {

          
              var sfsResultPolygon = new SimpleFillSymbol();
              sfsResultPolygon.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.5]), 1));
              sfsResultPolygon.setColor(new Color([85, 255, 0, 0.55]));
              console.log("resultados",results)
              
              console.log("elmapa", this.map)
              var pvResult = results.results[0];
              var gpFeatureRecordSetLayer = pvResult.value;
              var arrayFeatures = gpFeatureRecordSetLayer.features;
              console.log("array", arrayFeatures)
    
              
              
              array.forEach(arrayFeatures, lang.hitch(this, function (feature) {
                console.log("entidades", feature)
                feature.setSymbol(sfsResultPolygon);
                this.map.graphics.add(feature);
    
            })) ;
    
    
            }


          ))
          var extentViewshed = graphicsUtils.graphicsExtent(this.map.graphics.graphics);
          this.map.setExtent(extentViewshed, true);

          

          var mapa = this.map
          console.log("prueba", mapa)
          tbDraw.deactivate()


        }
        console.log("mapa1", this.map)
      


      },

      onClose: function () {
        this.map.graphics.clear()
       
        console.log('onClose');
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });