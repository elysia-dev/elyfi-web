import axios, { AxiosResponse } from 'axios';

interface ISlateResponse {
	version: "v1"
	tokenId: string
	description: string,
	documents: {
		type: number,
		hash: string,
		provider: "slate" | "infura",
		link: string,
	}[]
}

const baseUrl = "https://slate.textile.io/ipfs";

export class Slate {
	static fetctABTokenIpfs = async (ipfsHash: string): Promise<AxiosResponse<ISlateResponse>> => {
		return axios.get(
			`${baseUrl}/${ipfsHash}`,
		)
	}
}

export default Slate