import { ChangeEventHandler } from "react";

interface Props {
  coverImageURL: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
}

function ImageInput({ coverImageURL, handleChange }: Props) {
  return (
    <div className="tags-input image-input">
      <label>Cover image</label>
      <div className="input">
        <input
          type="text"
          name="coverImageURL"
          value={coverImageURL}
          onChange={handleChange}
          placeholder="Tag name that suits your post"
        />
      </div>
      <div className="note">
        Note you can upload image here which will you image URL and you can use
        that for cover image OR else use someother image URL
      </div>
      {coverImageURL ? (
        <div className="display-cover-img">
          <img src={`${coverImageURL}`} alt="cover image" />
        </div>
      ) : null}
    </div>
  );
}

export default ImageInput;
