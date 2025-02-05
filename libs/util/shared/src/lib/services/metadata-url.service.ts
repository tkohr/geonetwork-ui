import { Inject, Injectable } from '@angular/core'
import { BASE_PATH } from '@geonetwork-ui/data-access/gn4'
import { TranslateService } from '@ngx-translate/core'
import { LANG_2_TO_3_MAPPER } from '@geonetwork-ui/util/i18n'

@Injectable({
  providedIn: 'root',
})
export class MetadataUrlService {
  constructor(
    private translate: TranslateService,
    @Inject(BASE_PATH) private basePath: string
  ) {}

  getUrl(uuid: string, apiPath: string = this.basePath) {
    const prefix = `${apiPath}/../`
    return `${prefix}${
      LANG_2_TO_3_MAPPER[this.translate.currentLang]
    }/catalog.search#/metadata/${uuid}`
  }
}
