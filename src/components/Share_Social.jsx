/* eslint-disable @next/next/no-img-element */
import { FacebookShareButton, PinterestShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton } from 'react-share';

const Share_Social = ({ id_param, data_image }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">Chia sẻ:</span>
            <FacebookShareButton url={`https://ezpics.vn/specified-printed/${id_param}`}>
                <img
                    className="social-icons"
                    src="/images/fb_logo.png"
                    alt="fb"
                />
            </FacebookShareButton>
            <TwitterShareButton url={`https://ezpics.vn/specified-printed/${id_param}`}>
                <img
                    className="social-icons"
                    src="/images/twitter.png"
                    alt="twitter"
                />
            </TwitterShareButton>
            <TelegramShareButton
                url={`https://ezpics.vn/specified-printed/${id_param}`}
            >
                <TelegramIcon size={26} round />
            </TelegramShareButton>
            {/* <FacebookMessengerShareButton url={`https://ezpics.vn/specified-printed/${id_param}`}>
                <img
                    className="social-icons"
                    src="/images/messenger.png"
                    alt="messicon"
                />
            </FacebookMessengerShareButton> */}
            <PinterestShareButton url={`https://ezpics.vn/specified-printed/${id_param}`} media={data_image}>
                <img
                    className="social-icons"
                    src="/images/pinterest.png"
                    alt="pinterest"
                />
            </PinterestShareButton>
        </div>
    )
}

export default Share_Social
