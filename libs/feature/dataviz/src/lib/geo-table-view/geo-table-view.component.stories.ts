import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FeatureMapModule } from '@geonetwork-ui/feature/map'
import { UiLayoutModule } from '@geonetwork-ui/ui/layout'
import { UiMapModule } from '@geonetwork-ui/ui/map'
import { FEATURE_COLLECTION_POINT_FIXTURE_4326 } from '@geonetwork-ui/util/shared'
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular'
import { GeoTableViewComponent } from './geo-table-view.component'

export default {
  title: 'Map/GeoTable',
  component: GeoTableViewComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientModule,
        UiMapModule,
        UiLayoutModule,
        FeatureMapModule,
        BrowserAnimationsModule,
      ],
    }),
    componentWrapperDecorator(
      (story) => `<div style="height: 400px">${story}</div>`
    ),
  ],
} as Meta<GeoTableViewComponent>

const Template: Story<GeoTableViewComponent> = (
  args: GeoTableViewComponent
) => ({
  component: GeoTableViewComponent,
  props: args,
})

export const POINTS = Template.bind({})
POINTS.args = {
  data: FEATURE_COLLECTION_POINT_FIXTURE_4326,
}
