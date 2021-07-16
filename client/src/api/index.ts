import axios from "axios";
import { ILink, IResponse } from "../@types";

export const postGraphData = async (
  links: ILink[],
  featuresFileContent: string
): Promise<IResponse> =>
  await axios
    .post("http://localhost:5000/api/predict", {
      links,
      features_string: featuresFileContent,
    })
    .then(({ data }) => data);
