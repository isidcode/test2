// src/components/tools.component.jsx
import Embed      from "@editorjs/embed"
import List       from "@editorjs/list"
import Image      from "@editorjs/image"
import Header     from "@editorjs/header"
import Quote      from "@editorjs/quote"
import Marker     from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import axios      from "axios"

// Upload image via URL (user pastes an image link)
const uploadImageByURL = (url) => {
  return Promise.resolve({
    success: 1,
    file: { url },
  })
}

// Upload image by file (user picks from disk)
const uploadImageByFile = (file) => {
  return axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async ({ data: { uploadURL } }) => {
      await axios({
        method: "PUT",
        url: uploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: file,
      })
      const imageURL = uploadURL.split("?")[0]
      return { success: 1, file: { url: imageURL } }
    })
}

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl:  uploadImageByURL,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker:     Marker,
  inlineCode: InlineCode,
}