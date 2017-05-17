const authenticate = require('endomondo-unofficial-api').authenticate;
const workouts = require('endomondo-unofficial-api').workouts;
const workoutGet = require('endomondo-unofficial-api').workout.get;
const workoutSet = require('endomondo-unofficial-api').workout.set
const fixTracks = require('endomondo-unofficial-api').workout.fix
const track = require('endomondo-unofficial-api').attributes.track;
const sport = require('endomondo-unofficial-api').attributes.sport;
const gpx = require('endomondo-unofficial-api').gpx;

/* example of a valid track point set */
const trackPoints = [
    {
      time: Date.parse("2017-05-12 15:39:25 UTC"),
      longitude: 8.2555906,
      latitude: 47.3491986,
      altitude: 444.1,
      inst: track.START
    },
    {
      time: Date.parse("2017-05-12 15:39:27 UTC"),
      longitude: 8.1555906,
      latitude: 47.2491986,
      altitude: 444.1,
    },
    {
      time: Date.parse("2017-05-12 15:39:30 UTC"),
      longitude: 8.1665917,
      latitude: 47.3492244,
      altitude: 444.1,
      inst: track.END
    }
];

const main = async() => {

    /* read tracks from gpx file */
    let tracks = await new Promise((resolve) => gpx.parseGpxFromFile("Current.gpx", (err, data) => {
      if(err) {
        console.log("Could not parse GPX file");
        reject(err);
      }
      resolve(data);
    }));

    /* connect to endomondo */
    const auth = await authenticate({email: "<username>", password: "<password>"});
    console.log(auth);

    /* fix / split tracks if long delay between two points */
    tracks = fixTracks(tracks, 24 * 60, 0.1);
    console.log("Numbor of tracks: " + tracks.length);
    //return;

    for(let i = 0; i < tracks.length; i++) {
        const track = tracks[i];

        /* create new workout, write first couple of points */
        const step = 20; // write 20 points in one request
        const newWork = await workoutSet({
              authToken: auth.authToken,
              sport:sport.CYCLING,
              distance: 0,
              duration: 0,
              points: track.slice(0, step)
        });
        //console.log(newWork);

        /* write remaining points to existing workout */
        for(let idx = 0; idx < track.length; idx += step)
        {
          const ps = track.slice(idx, idx + step);
          const updWork = await workoutSet({
                authToken: auth.authToken,
                userId: auth.userId,
                workoutId: newWork.workoutId,
                sport: sport.CYCLING,
                distance: ps[ps.length - 1].dist.all,
                duration: (ps[ps.length - 1].time - track[0].time) / 1000,
                points: ps
          });
          console.log(idx + "-" + (idx + ps.length) + ": " + JSON.stringify(ps[ps.length - 1]));

          /* wait befor sending next points */
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    /* get a list of all workouts */
    const works = await workouts({authToken: auth.authToken});
    console.log(works);

    /* show latest workout */
    const work = await workoutGet({authToken: auth.authToken, workoutId: works.data[0].id});
    console.log(work);

};
main();
