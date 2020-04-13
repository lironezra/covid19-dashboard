
/**
 * trackerLocationsToGeoJson
 * @param {array} locations - Coronavirus Tracker location objects array
 */

export function trackerLocationsToGeoJson(data) {
    //if ( locations.length === 0 ) return;
  
    return {
        "type": "FeatureCollection",
        "features": data.map((country = {}) => {
          const { countryInfo = {} } = country;
          const { lat, long: lng } = countryInfo;
          return {
            type: "Feature",
            properties: {
              ...country,
            },
            geometry: {
              type: "Point",
              coordinates: [ lng, lat ]
            }
          }
        })
    }
  }
  
  /**
   * trackerFeatureToHtmlMarker
   */
  
  export function trackerFeatureToHtmlMarker({ properties = {} } = {}) {
    const {
      country,
      updated,
      flag,
      cases,
      deaths,
      recovered
    } = properties
  
    let casesString = `${cases}`;
  
    if ( cases > 1000 ) {
      casesString = `${casesString.slice(0, -3)}k+`
    }
  
    return `
      <span class="icon-marker">
        <span class="icon-marker-tooltip">
          <h2>${flag} ${country}</h2>
          <ul>
            <li><strong>Confirmed:</strong> ${cases}</li>
            <li><strong>Deaths:</strong> ${deaths}</li>
            <li><strong>Recovered:</strong> ${recovered}</li>
            <li><strong>Last Update:</strong> ${updated}</li>
          </ul>
        </span>
        ${ casesString }
      </span>
    `;
  }