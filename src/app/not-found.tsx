import Image from 'next/image';
import Link from 'next/link'
 
export default function NotFound() {
    return (
        <div className='pageNotFound'>
			<div className='content'>
                <div className='block'>
                    <p className='ttl'>404!</p>
                    <p className='txt'>Trang không tồn tại</p>
                    <Link className='link' href="/">Trở về trang chủ</Link>
                </div>
                <figure className='image'>
                    <Image width={0} height={0} alt='' src="/img/common/icon_face_1.svg" />
                </figure>
            </div>
        </div>
    )
}