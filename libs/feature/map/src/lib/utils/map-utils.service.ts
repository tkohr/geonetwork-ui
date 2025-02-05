import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import type { FeatureCollection } from 'geojson'
import OlFeature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { Geometry } from 'ol/geom'
import Map from 'ol/Map'
import { Source } from 'ol/source'
import ImageWMS from 'ol/source/ImageWMS'
import TileWMS from 'ol/source/TileWMS'
import Layer from 'ol/layer/Layer'
import VectorSource from 'ol/source/Vector'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const FEATURE_PROJECTION = 'EPSG:3857'
const DATA_PROJECTION = 'EPSG:4326'

@Injectable({
  providedIn: 'root',
})
export class MapUtilsService {
  constructor(private http: HttpClient) {}

  createEmptyMap(): Map {
    const map = new Map({
      controls: [],
      pixelRatio: 1,
    })
    return map
  }

  readFeatureCollection = (
    featureCollection: FeatureCollection,
    featureProjection = FEATURE_PROJECTION,
    dataProjection = DATA_PROJECTION
  ): OlFeature<Geometry>[] => {
    const olFeatures = new GeoJSON().readFeatures(featureCollection, {
      featureProjection,
      dataProjection,
    })
    return olFeatures
  }

  isWMSLayer(layer: Layer<Source>): boolean {
    return (
      layer.getSource() instanceof TileWMS ||
      layer.getSource() instanceof ImageWMS
    )
  }

  getGFIUrl(layer, map, coordinate): string {
    const view = map.getView()
    const projection = view.getProjection()
    const resolution = view.getResolution()
    const source = layer.getSource()
    const params = {
      ...source.getParams(),
      INFO_FORMAT: 'application/json',
    }
    const url = source.getFeatureInfoUrl(
      coordinate,
      resolution,
      projection,
      params
    )
    return url
  }

  getVectorFeaturesFromClick(olMap, event): OlFeature<Geometry>[] {
    const features = []
    const hit = olMap.forEachFeatureAtPixel(
      event.pixel,
      (feature: OlFeature<Geometry>) => {
        return feature
      },
      { layerFilter: (layer) => layer.getSource() instanceof VectorSource }
    )
    if (hit) {
      features.push(hit)
    }
    return features
  }

  getGFIFeaturesObservablesFromClick(
    olMap,
    event
  ): Observable<OlFeature<Geometry>[]>[] {
    const wmsLayers = olMap.getLayers().getArray().filter(this.isWMSLayer)

    if (wmsLayers.length > 0) {
      const { coordinate } = event
      const gfiUrls = wmsLayers.reduce(
        (urls, layer) => [...urls, this.getGFIUrl(layer, olMap, coordinate)],

        []
      )
      return gfiUrls.map((url) =>
        this.http
          .get<FeatureCollection>(url)
          .pipe(map((collection) => this.readFeatureCollection(collection)))
      )
    } else {
      return []
    }
  }
}
