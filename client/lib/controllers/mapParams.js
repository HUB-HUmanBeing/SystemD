const mapParams = {
    providers: [
        // {
        //     name: "mapParams.standard",
        //     imgUrl: '/images/mapPreviews/standard.png',
        //     url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        //     options: {
        //         maxZoom: 20,
        //         attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap Contributors </a> Tiles \u00a9 HOT'
        //     }
        // },
        {
            name: "mapParams.standard",
            imgUrl: '/images/mapPreviews/standard.png',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        {
            name: "mapParams.topo",
            imgUrl: '/images/mapPreviews/topo.png',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            options: {
                maxZoom: 17,
                attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
        },
        {
            name: "mapParams.aerial",
            imgUrl: '/images/mapPreviews/aerial.png',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            options: {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
        },
    ],
    colors: [

        "#205386",
        "#286e2c",
        "#ecba00",
        "#d25a00",
        "#961717",
        "#8110b9",
        "#445963"

        // "#71112a",
        // "#6b2c89",
        // "#183c71",
        // "#286743",
        // "#9baa14",
        // "#ac701d",
        // "#546e7a"
    ],
    shapes:
        {
            icons: [
                "star_border",
                "people_outline",
                "perm_identity",
                "group",
                "person",
                "favorite",

                "directions_car",
                "airport_shuttle",
                "local_shipping",
                "local_parking",
                "assistant_photo",
                "block",
                "location_disabled",
                "location_searching",
                "gps_fixed",
                "flash_on",
                "security",
                "remove_red_eye",
                "filter_drama",
                "store",
                "warning",
                "help_outline",
                "local_hospital",

                "whatshot"
            ]
        }
}
export default mapParams
