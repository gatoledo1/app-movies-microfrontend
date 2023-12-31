import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { BsStarHalf } from "react-icons/bs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMovie } from "../../services/getMovie";
import defaultImage from "../../assets/no-image.jpg";
import Movie from "../../components/Movie";
import "./styles.scss";
import { MovieData } from "../../types/MovieData";
import { getProviders } from "../../services/getProviders";

const Details = () => {
  let navigate = useNavigate();

  const [movie, setMovie] = useState<MovieData>();

  useEffect(() => {
    const regex = /([^/]+)\/?$/;
    const pathname = regex.exec(window.location.pathname);

    async function fetchMovie(id: string) {
      const [dataDetails, dataProviders] = await Promise.all([getMovie("movie", id), getProviders("movie", id)]);
      setMovie({ ...dataDetails, providers: { ...dataProviders.results?.BR } });
    }
    fetchMovie(pathname[0]);
  }, []);

  return (
    <div className="details-block">
      <div className="back" role="button" aria-pressed="false" onClick={() => navigate(-1)}>
        <MdArrowBack />
      </div>
      {movie && (
        <div className="container-details">
          <div className="flex-details">
            <div className="cover-img">
              <Movie movie={movie} detailsPage={true} />
              {movie?.homepage && (
                <a className="site" href={movie?.homepage}>
                  <span> Acessar site do filme </span>
                  <FiExternalLink />
                </a>
              )}
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 className="section-title" style={{ marginTop: 0 }}>
                {movie.title}
              </h1>
              {movie.overview && (
                <div>
                  <h4>Overview</h4>
                  <p>{movie.overview}</p>
                </div>
              )}

              <div className="flex-items">
                <div>
                  <h4>Gêneros</h4>
                  <ul>
                    {movie.genres.map((genre) => (
                      <li key={genre.id}>{genre.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Produtoras</h4>
                  <ul>
                    {movie.production_companies.map((company) => (
                      <li key={company.id}>{company.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Países</h4>
                  <ul>
                    {movie.production_countries.map((prod, index) => (
                      <li key={index}>{prod.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Lançamento</h4>
                  <p>{movie.release_date}</p>
                </div>
                <div>
                  <h4>Nota</h4>
                  <p id="rate">
                    <BsStarHalf />
                    {movie.vote_average}
                  </p>
                </div>
              </div>

              {movie.providers?.flatrate && (
                <>
                  <h4>Disponivel por assinatura</h4>
                  <div className="flex-items provider-items">
                    {movie.providers?.flatrate?.map((item, index) => (
                      <div key={index}>
                        <img src={"https://image.tmdb.org/t/p/w200" + item.logo_path} className="provider-images" alt="provider-cover" />
                        <p>{item.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {movie.providers?.buy && (
                <>
                  <h4>Disponivel para compra ou aluguel</h4>
                  <div className="flex-items provider-items">
                    {movie.providers?.buy?.map((item, index) => (
                      <div key={index}>
                        <img src={"https://image.tmdb.org/t/p/w200" + item.logo_path} className="provider-images" alt="provider-cover" />
                        <p>{item.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {movie.poster_path !== null ? (
            <img alt="cover" className="img-bg" src={"https://image.tmdb.org/t/p/w500" + movie.backdrop_path} />
          ) : (
            <img className="img-bg" src={defaultImage} alt="cover" />
          )}
        </div>
      )}
    </div>
  );
};

export default Details;
