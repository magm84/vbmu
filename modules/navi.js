const {
    firstValueFrom,
    map,
    from,
    catchError,
    of
  } = require("rxjs");
  const axios = require('axios');
  
  class VBNavi {
    constructor({
      endpoint = null,
      username = null,
      password = null,
      domain = "www",
      channelType = "web",
    }) {
  
      this.endpoint = endpoint;
      this.username = username;
      this.password = password;
      this.domain =  domain;
      this.channelType =  channelType;
      
    }
  
    /**
     * GET NAVITAIRE TOKEN
     * @returns {Promise<string>}
     */
    async getToken() {
      const token = await firstValueFrom(
        from(
          axios({
            url: `${this.endpoint}/api/auth/v1/token/user`,
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              credentials: {
                username: this.username,
                password: this.password,
                domain: this.domain,
                channelType: this.channelType,
              },
            },
            method: "post",
          })
        ).pipe(
          map((d) => d.data.data.token),
          catchError((e) => {
            console.error("error getting token => ", e);
            return of(null);
          })
        )
      );
  
      return token;
    }
  
      /**
     * GET NAVITAIRE QUEUE ITEMS
     * @returns {Promise<string>}
     */
    async getQueueItems({queueCode = null, token = "", itemQty = 100, afterDays = 2, beforeDays = 2}) {
  
      if(token === "" || queueCode === null) {
        return [];
      }
  
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
  
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - beforeDays);
  
      const tomorroy = new Date(today);
      const nextYear = today.getFullYear() + afterDays;
      tomorroy.setFullYear(nextYear);
  
      const StartDate = formatDate(yesterday);
      const EndDate = formatDate(tomorroy);
      const PageSize = parseInt(itemQty);
  
      const queueRequest = {
        url: `${this.endpoint}/api/nsk/v2/bookings/queues/${queueCode}/items?StartDate=${StartDate}&EndDate=${EndDate}&PageSize=${PageSize}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const queueList = await firstValueFrom(
        from(axios(queueRequest)).pipe(
          // tap(d => console.log('queue list response => ', d.data.data)),
          map((d) => d.data.data.retrieveBookingQueueResponseItems),
          catchError((e) => {
            console.log("error from queue list");
            if (typeof e.response !== "undefined") {
              console.error(e.response.data);
            } else {
              console.error(e);
            }
            return of([]);
          })
        )
      );
  
      return queueList;
  
    }
  
  
    deleteNavitaireQueueItem({queueCode = null,bookingQueueKey = null, token = "", authorName = ""}) {
  
      const deleteNavitaireRequest = {
        url: `${this.endpoint}/api/nsk/v1/queues/bookings/${queueCode}/items/${bookingQueueKey}`,
        method: "delete",
        data: {
          authorizedBy: authorName,
          notes: `${authorName} deleted this item`,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      return from(axios(deleteNavitaireRequest)).pipe(
        map((d) => d.status),
        catchError((e) => {
          return of(500);
        })
      );
    }
  
    getRecordLocatorByPNR({recordLocator = null, token = ""}) {
  
      const axiosRequest = {
        url: `${this.endpoint}/api/nsk/v1/booking/retrieve/byRecordLocator/${recordLocator}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return from(axios(axiosRequest)).pipe(
        map((d) => d.data.data),
        catchError((e) => {
          console.error(
            `error getting ${recordLocator} reservation data from navitaire`
          );
          if (typeof e.response !== "undefined") {
            console.log(e.response);
          } else {
            console.error(e);
          }
          return of(null);
        })
      );
    }
  }
  
  module.exports = Navitaire;