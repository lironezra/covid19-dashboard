import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { Tabs, TabList, TabPanel, Tab } from 'react-re-super-tabs'
import L from 'leaflet';

import { getCountriesData, getGlobalData } from '../services/Tracker';
import { trackerLocationsToGeoJson } from '../lib/coronavirus';
import { useWindowSize } from '../hooks/useWindowSize'

import CustomTab from '../components/Tab';
import WithSpinner from '../hoc/with-spinner';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Map from '../components/Map';
import Chart from '../components/Chart'
import ListWidget from '../components/ListWidget';
import ListWidget2 from '../components/ListWidget2';
import BannerWidget from '../components/BannerWidget';
import UpdatedAtWidget from '../components/UpdatedAtWidget';
import About from '../components/About';
import Slider from '../components/Slider';
import NotFoundError from '../components/NotFoundError';

// Mobile
import ListBannerWidget from '../components/ListBannerWidget';

const SectionWithSpinner = WithSpinner(Section);


const LOCATION = {
  lat: 7,
  lng: 22
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1;

const defaultState = {
  isLoading: true,
  apiError: null,
  mapData: null,
  chartData: null,
  infectedCountries: 0,
  countriesCordinates: null,
  totalCasesByCountry: null,
  totalRecoveredByCountry: null,
  totalDeathsByCountry: null,
  totalConfirmedNumber: 0,
  totalRecoveredNumber: 0,
  totalDeathNumber: 0,
  lastUpdated: null,
  flyTo: null
}

const IndexPage = () => {
  const [state = {}, updateState] = useState(defaultState);
  const [width, height] = useWindowSize();

  

  const fetchData = async () => {
    const countriesDataResponse = await getCountriesData("critical");
    const globalDataResponse = await getGlobalData();

    if(!countriesDataResponse.data || !globalDataResponse.data) {
      updateState(prev => {
        return {
          ...prev,
          apiError: countriesDataResponse
        }
      })
    }

    setApplicationData(countriesDataResponse, globalDataResponse);

    updateState(prev => {
      return {
        ...prev,
        isLoading: false
      }
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setApplicationData = (countriesDataResponse, globalDataResponse) => {
    const { data: countriesData } = countriesDataResponse;
    const { data: globalData } = globalDataResponse;

    if (countriesData && globalData) {
      updateState(prev => {
        return {
          ...prev,
          mapData: countriesData,
          chartData: getCriticalStateByCountry(countriesData),
          infectedCountries: getInfectedCountriesNumber(countriesData),
          countriesCordinates: getCountriesLongLat(countriesData),
          totalCasesByCountry: getStateCasesByCountry(countriesData, "cases"),
          totalRecoveredByCountry: getStateCasesByCountry(countriesData, "recovered"),
          totalDeathsByCountry: getStateCasesByCountry(countriesData, "deaths"),
          totalConfirmedNumber: globalData.cases,
          totalRecoveredNumber: globalData.recovered,
          totalDeathNumber: globalData.deaths,
          lastUpdated: new Date(globalData.updated).toLocaleString('en-GB')
        }
      })
    }

  }

  const getCountriesLongLat = data => {
    let cor = data.map((country = {}) => {
      const { countryInfo = {} } = country;
      const { lat, long: lng } = countryInfo;
      return {
        country: countryInfo._id,
        lat,
        lng
      }
    });
    return cor;
  }

  const getCriticalStateByCountry = data => {
    let stateCases
    if (data) {
      // First filter the countries without country _id
      stateCases = data.filter(el => el.critical > 0).map(item => {
        const container = {};

        container.country = item.country;
        container.number = item.critical;

        return container;
      });
    }
    return stateCases;
  }

  const getStateCasesByCountry = (countries, infectedType) => {
    let stateCases
    if (countries) {
      // First filter the countries without country _id
      stateCases = countries.filter(el => el.countryInfo._id).map(item => {
        const container = {};

        container.id = item.countryInfo._id;
        container.country = item.country;
        container[infectedType] = item[infectedType];

        return container;
      });
    }
    return stateCases;
  }

  const getInfectedCountriesNumber = countries => {
    return countries.filter(country => country.cases > 0).length;
  }

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  //async function mapEffect({ leafletElement: map } = {}) {
  function mapEffect({ leafletElement: map } = {}) {
    const data = state.mapData;
    const hasData = Array.isArray(data) && data.length > 0;
    if ( !hasData ) return;

    if ( !map || !hasData ) return;

    const geoJson = trackerLocationsToGeoJson(data);

    // Adding the Coronavirus data to the map
    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let casesString;
    
        const {
          country,
          cases,
          deaths,
          recovered
        } = properties
    
        casesString = `${cases}`;
    
        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }
    
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li class="confirmed"><span>Confirmed:</span> ${cases}</li>
                <li class="deaths"><span>Deaths:</span> ${deaths}</li>
                <li class="recovered"><span>Recovered:</span> ${recovered}</li>
                <li class="active"><span>Active:</span> ${cases-deaths-recovered}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;
    
        return L.marker( latlng, {
          icon: L.divIcon({
            className: "icon",
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo(map);

    if(state.flyTo) {
      const { flyTo } = state;
      map.flyTo({lon: flyTo.lng, lat: flyTo.lat}, 6);
    }
  }

  let mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    minZoom: 1,
    mapEffect
  };

  const handleListItemClicked = countryId => {
    let countryCordinates = state.countriesCordinates.find(item => item.country === countryId);

    // update the state with new cordinates for Map component
    updateState(prev => {
      return {
        ...prev,
        flyTo: countryCordinates
      }
    })
  }

  const renderContent = () => {
    //debugger;
    if(state.apiError) {
      return <NotFoundError />;
    }

    if (width <= 767) { 
      return (
        <>
          <SectionWithSpinner className="tabs-container" isLoading={state.isLoading}>
            <Tabs activeTab='totals'>
              <TabList>
                <Tab component={CustomTab} label='Totals' id='totals' />
                <Tab component={CustomTab} label='World' id='world' />
                <Tab component={CustomTab} label='Graphs' id='graphs' />
                <Tab component={CustomTab} label='Map' id='map' />
                <Tab component={CustomTab} label='About' id='info' />

              </TabList>
              <TabList>
                <TabPanel component={ () =>
                        <ListBannerWidget>
                          <BannerWidget 
                              header="Total Confirmed"
                              value={state.totalConfirmedNumber}
                              className="banner-wrapper-mobile"
                              type="bConfirmed" />
                          <BannerWidget 
                              header="Total Deaths"
                              value={state.totalDeathNumber}
                              className="banner-wrapper-mobile"
                              type="bDeaths" />
                          <BannerWidget 
                              header="Total Recovered"
                              value={state.totalRecoveredNumber}
                              className="banner-wrapper-mobile" 
                              type="bRecovered"/>
                          <BannerWidget 
                              header="Infected Countries"
                              value={state.infectedCountries}
                              className="banner-wrapper-mobile"
                              type="bDefault" />
                      </ListBannerWidget>
                } id='totals' />
                <TabPanel component={() => 
                      <>
                        <ListWidget 
                          title="Confirmed Cases By Country" 
                          data={state.totalCasesByCountry} 
                          type="cases"
                          listItemClicked={handleListItemClicked} />
                        <ListWidget2 
                          type="recovered"
                          data={state.totalRecoveredByCountry}
                          title="Total Recovered By Country"
                          listItemClicked={handleListItemClicked} />
                        <ListWidget2 
                          type="deaths"
                          data={state.totalDeathsByCountry}
                          title="Total Deaths By Country "
                          listItemClicked={handleListItemClicked} />
                      </>
                        } 
                id='world' />
                <TabPanel component={() => 
                        <div className="charts-wrapper mobile">
                          <Chart
                          className="bar-chart"
                          title="Critical Cases By Country"
                          margin={{
                            top: 10, right: 10, left: 10, bottom: 50,
                          }}
                          data={state.chartData}
                          xDataKey="country"
                          barDataKey="number"
                          />
                        </div>} 
                id='graphs' />
                <TabPanel component={() => <Map {...mapSettings} />} 
                id='map' />
                <TabPanel component={() => <About />} id="info" />
              </TabList>
            </Tabs>
            <Slider>{`Last updated at: ${state.lastUpdated}`}</Slider>  
          </SectionWithSpinner>
        </>
      )
    }

    return (
      <>
        <SectionWithSpinner className="left-section" isLoading={state.isLoading}>
          <BannerWidget 
            header="Total Confirmed"
            value={state.totalConfirmedNumber}
            className="banner-wrapper-desktop" />
          <ListWidget 
            title="Confirmed Cases by Country/Region/Sovereignty" 
            data={state.totalCasesByCountry} 
            type="cases"
            listItemClicked={handleListItemClicked}
            />
          <UpdatedAtWidget 
            lastUpdated={state.lastUpdated} />
        </SectionWithSpinner>
        <SectionWithSpinner className="middle-section" isLoading={state.isLoading}>
                      <Map {...mapSettings} />
          <div className="bottom-wrapper">

            <div className="infected-countries">
              <span className="banner-value">{state.infectedCountries}</span>
              <span className="banner-title">Infected Countries</span>
            </div>

            <About />
          </div>
        </SectionWithSpinner>        
        <SectionWithSpinner className="right-section" isLoading={state.isLoading}>
        <div className="list-wigets-wrapper">
          <div className="total-deaths-section">
            <ListWidget2 
              type="deaths"
              data={state.totalDeathsByCountry}
              title="Total Deaths"
              titleValue={state.totalDeathNumber}
              listItemClicked={handleListItemClicked} />
          </div>
          <div className="total-recovered-section">
            <ListWidget2 
              type="recovered"
              data={state.totalRecoveredByCountry}
              title="Total Recovered"
              titleValue={state.totalRecoveredNumber}
              listItemClicked={handleListItemClicked} />
          </div>
        </div>
        <div className="charts-wrapper desktop">        
          <Chart
            className="bar-chart"
            title="Critical Cases By Country"
            // width={320}
            // height={140}
            margin={{
              top: 10, right: 10, left: 10, bottom: 20,
            }}
            data={state.chartData}
            xDataKey="country"
            barDataKey="number"
            />
        </div>
      </SectionWithSpinner>
      </>
    )
  }

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Coronavirus COVID-19 Global Cases</title>
      </Helmet>
      {renderContent()}
    </Layout>
  );
};

export default IndexPage;
