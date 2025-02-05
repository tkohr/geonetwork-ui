import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import Feature from 'ol/Feature'
import { Geometry } from 'ol/geom'

import Map from 'ol/Map'
import { FeatureInfoService } from '../../feature-info/feature-info.service'
import { MapManagerService } from '../../manager/map-manager.service'
import { MapContextModel } from '../map-context.model'
import { MapContextService } from '../map-context.service'

@Component({
  selector: 'gn-ui-map-context',
  templateUrl: './map-context.component.html',
  styleUrls: ['./map-context.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapContextComponent implements OnInit {
  @Input() context: MapContextModel
  @Output() featureClicked = new EventEmitter<Feature<Geometry>[]>()

  map: Map

  constructor(
    private service: MapContextService,
    private featureInfo: FeatureInfoService,
    private manager: MapManagerService
  ) {
    this.map = manager.map
  }

  ngOnInit(): void {
    this.service.resetMapFromContext(this.map, this.context)
  }
}
