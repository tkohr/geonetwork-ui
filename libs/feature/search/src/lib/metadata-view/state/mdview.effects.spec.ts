import { TestBed } from '@angular/core/testing'
import { SearchApiService } from '@geonetwork-ui/data-access/gn4'
import { ElasticsearchMapper } from '../../elasticsearch/mapper'
import { ElasticsearchService } from '../../elasticsearch/'
import { MetadataRecord } from '@geonetwork-ui/util/shared'

import { provideMockActions } from '@ngrx/effects/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from '@nrwl/angular/testing'

import { Observable, of, throwError } from 'rxjs'

import * as MdViewActions from './mdview.actions'
import { MdViewEffects } from './mdview.effects'

const incomplete = {
  uuid: '1231321321',
  title: 'title',
} as MetadataRecord

const full = {
  uuid: '1231321321',
  title: 'title',
  abstract: 'abstract',
} as MetadataRecord

const searchServiceMock = {
  search: () => of({ hits: { hits: [] }, aggregations: { abc: {} } }),
  configuration: {
    basePath: 'http://geonetwork/srv/api',
  },
}
const esMapperMock = {
  toRecords: () => [full],
}
const esServiceMock = {
  getMetadataByIdPayload: jest.fn,
}

describe('StationsEffects', () => {
  let actions: Observable<any>
  let effects: MdViewEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MdViewEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        {
          provide: SearchApiService,
          useValue: searchServiceMock,
        },
        {
          provide: ElasticsearchService,
          useValue: esServiceMock,
        },
        {
          provide: ElasticsearchMapper,
          useValue: esMapperMock,
        },
      ],
    })

    effects = TestBed.inject(MdViewEffects)
  })

  describe('loadFullRecord$', () => {
    describe('when api sucess', () => {
      it('dispatch loadFullSuccess', () => {
        actions = hot('-a-|', {
          a: MdViewActions.loadFullMetadata({ uuid: full.uuid }),
        })
        const expected = hot('-a-|', {
          a: MdViewActions.loadFullSuccess({ full }),
        })
        expect(effects.loadFull$).toBeObservable(expected)
      })
    })
    describe('when api fails', () => {
      beforeEach(() => {
        searchServiceMock.search = jest.fn(() => throwError('api'))
      })
      it('dispatch loadFullFailure', () => {
        actions = hot('-a-|', {
          a: MdViewActions.loadFullMetadata({ uuid: full.uuid }),
        })
        const expected = hot('-(a|)', {
          a: MdViewActions.loadFullFailure({ error: 'api' }),
        })
        expect(effects.loadFull$).toBeObservable(expected)
      })
    })
  })
})
