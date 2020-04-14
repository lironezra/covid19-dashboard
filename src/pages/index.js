import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';

import { getCountriesData, getGlobalData } from '../services/Tracker';
import { trackerLocationsToGeoJson } from '../lib/coronavirus'


import WithSpinner from '../hoc/with-spinner';
import Layout from '../components/Layout';
import Map from '../components/Map';
import Chart from '../components/Chart'
import ListWidget from '../components/ListWidget';
import ListWidget2 from '../components/ListWidget2';
import TotalConfirmedWidget from '../components/TotalConfirmedWidget';
import UpdatedAtWidget from '../components/UpdatedAtWidget';

// Components with spinner HOC
const TotalConfirmedWidgetWithSpinner = WithSpinner(TotalConfirmedWidget);
const ListWidgetWithSpinner = WithSpinner(ListWidget);
const ListWidget2WithSpinner = WithSpinner(ListWidget2); 
const UpdatedAtWidgetWithSpinner = WithSpinner(UpdatedAtWidget);
const MapWithSpinner = WithSpinner(Map);
const ChartWithSpinner = WithSpinner(Chart);

const LOCATION = {
  lat: 10,
  lng: 22
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1;

const defaultState = {
  isLoading: true,
  mapData: null,
  chartData: null,
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

  const fetchData = async () => {
    const countriesDataResponse = await getCountriesData("critical");
    const globalDataResponse = await getGlobalData();
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

    updateState(prev => {
      return {
        ...prev,
        mapData: countriesData,
        chartData: getCriticalStateByCountry(countriesData),
        countriesCordinates: getCountriesLongLat(countriesData),
        totalCasesByCountry: getStateCasesByCountry(countriesData, "cases"),
        totalRecoveredByCountry: getStateCasesByCountry(countriesData, "recovered"),
        totalDeathsByCountry: getStateCasesByCountry(countriesData, "deaths"),
        totalConfirmedNumber: globalData.cases,
        totalRecoveredNumber: globalData.recovered,
        totalDeathNumber: globalData.deaths,
        lastUpdated: new Date(globalData.updated).toLocaleString()
      }
    })
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

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Coronavirus COVID-19 Global Cases</title>
      </Helmet>

        <div className="left-section">
          <TotalConfirmedWidgetWithSpinner 
            totalConfirmedCases={state.totalConfirmedNumber}
            isLoading={state.isLoading} />
          <ListWidgetWithSpinner 
            title="Confirmed Cases by Country/Region/Sovereignty" 
            data={state.totalCasesByCountry} 
            type="cases"
            isLoading={state.isLoading}
            listItemClicked={handleListItemClicked}/>
          <UpdatedAtWidgetWithSpinner 
            lastUpdated={state.lastUpdated}
            isLoading={state.isLoading} />
        </div>
        
        <MapWithSpinner {...mapSettings} isLoading={state.isLoading} />

  
        <div className="right-section">
          <div className="list-wigets-wrapper">
            <div className="total-deaths-section">
              <ListWidget2WithSpinner 
                type="deaths"
                data={state.totalDeathsByCountry}
                title="Total Death"
                titleValue={state.totalDeathNumber}
                isLoading={state.isLoading}
                listItemClicked={handleListItemClicked} />
            </div>
            <div className="total-recovered-section">
              <ListWidget2WithSpinner 
                type="recovered"
                data={state.totalRecoveredByCountry}
                title="Total Recovered"
                titleValue={state.totalRecoveredNumber}
                isLoading={state.isLoading}
                listItemClicked={handleListItemClicked} />
            </div>
          </div>
          <ChartWithSpinner
            className="bar-chart"
            title="Critical Cases By Country"
            width={320}
            height={140}
            data={state.chartData}
            xDataKey="country"
            barDataKey="number"
            isLoading={state.isLoading}
            />

            {/* <LineChart width={310} height={140} className="line-chart"
             data={chartData}
             >
              <Line type="monotone" dataKey="uv" stroke="#FFAA00" activeDot={{ r: 3 }}/>
              <CartesianGrid stroke="#232" strokeDasharray="3 3"/>
              <XAxis dataKey="name" interval="preserveStart"/>
              <YAxis minTickGap="0" type="number" domain={[ 0, dataMax => (2000000) ]} interval="preserveEnd"/>
              <Tooltip />
            </LineChart> */}

        </div>

    </Layout>
  );
};

export default IndexPage;
