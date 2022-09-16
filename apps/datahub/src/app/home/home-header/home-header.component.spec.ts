import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AuthService } from '@geonetwork-ui/feature/auth'
import {
  RouterFacade,
  ROUTER_ROUTE_SEARCH,
} from '@geonetwork-ui/feature/router'
import { SearchFacade, SearchService } from '@geonetwork-ui/feature/search'
import { MetadataRecord } from '@geonetwork-ui/util/shared'
import { TranslateModule } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'
import { HomeHeaderComponent } from './home-header.component'
import { readFirst } from '@nrwl/angular/testing'

jest.mock('@geonetwork-ui/util/app-config', () => ({
  getThemeConfig: () => ({
    HEADER_BACKGROUND: 'red',
  }),
}))

const routerFacadeMock = {
  goToMetadata: jest.fn(),
  anySearch$: new BehaviorSubject('scot'),
  currentRoute$: new BehaviorSubject({}),
}

const searchFacadeMock = {
  setFavoritesOnly: jest.fn(),
}

const searchServiceMock = {
  updateSearch: jest.fn(),
}

const authServiceMock = {
  authReady$: new BehaviorSubject({}),
  authReady: jest.fn(() => this.authReady$),
}
/* eslint-disable */
@Component({
  selector: 'gn-ui-fuzzy-search',
  template: '',
})
class FuzzySearchComponentMock {
  @Input() value?: MetadataRecord
}
/* eslint-enable */

describe('HeaderComponent', () => {
  let component: HomeHeaderComponent
  let fixture: ComponentFixture<HomeHeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HomeHeaderComponent, FuzzySearchComponentMock],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: RouterFacade,
          useValue: routerFacadeMock,
        },
        {
          provide: SearchFacade,
          useValue: searchFacadeMock,
        },
        {
          provide: SearchService,
          useValue: searchServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('search route parameter', () => {
    it('passed to fuzzy search as AutoComplete item object', () => {
      const fuzzyCpt = fixture.debugElement.query(
        By.directive(FuzzySearchComponentMock)
      ).componentInstance
      expect(fuzzyCpt.value).toEqual({ title: 'scot' })
    })
    it('value is changed on route update', () => {
      routerFacadeMock.anySearch$.next('river')
      const fuzzyCpt = fixture.debugElement.query(
        By.directive(FuzzySearchComponentMock)
      ).componentInstance
      fixture.detectChanges()

      expect(fuzzyCpt.value).toEqual({ title: 'river' })
    })
  })
  describe('tabs navigation', () => {
    describe('click datasets tab', () => {
      beforeEach(() => {
        component.updateSearch()
      })
      it('calls searchService updateSearch with empty object', () => {
        expect(searchServiceMock.updateSearch).toHaveBeenCalledWith({})
      })
    })
  })
  describe('favorites badge', () => {
    describe('displayFavoritesBadge$', () => {
      beforeEach(() => {
        authServiceMock.authReady$.next({
          id: 'user-id',
          name: 'testuser',
        })
        routerFacadeMock.currentRoute$.next({
          url: [{ path: ROUTER_ROUTE_SEARCH }],
        })
      })
      it('displays favoriteBadge when authenticated and on search route', async () => {
        const displayFavoritesBadge = await readFirst(
          component.displayFavoritesBadge$
        )
        expect(displayFavoritesBadge).toEqual(true)
      })
    })
    describe('#listFavorites', () => {
      beforeEach(() => {
        component.listFavorites(true)
      })
      it('calls searchFacade setFavoritesOnly with correct value', () => {
        expect(searchFacadeMock.setFavoritesOnly).toHaveBeenCalledWith(true)
      })
    })
  })
})
