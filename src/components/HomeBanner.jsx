"use client"
import { useRef, useState } from 'react'
import Link from 'next/link'
import { SearchOutlined, StarOutlined } from '@ant-design/icons'

export default function HomeBanner() {

  const [arrowPosition, setArrowPosition] = useState('2%')
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState({
    action1: false,
    action2: false,
    action3: false,
    action4: false,
    action5: false,
    action6: false,
    action7: false,
    action8: false,
    action9: false,
  })

  const actions = [
    {
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        viewBox="0 0 32 32"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action1 ? 'rgb(69, 86, 239)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action1: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action1: false })}
      >
        <path
          d="M11.26 7.49c0-.36-.35-.45-.35-.45-1.55-.49-2.49-1.43-2.98-2.99 0 0-.06-.34-.45-.34-.38 0-.44.34-.44.34-.49 1.56-1.42 2.5-2.98 2.99 0 0-.35.09-.35.45s.35.45.35.45c1.56.49 2.49 1.43 2.98 2.99 0 0 .06.34.45.34.38-.01.45-.34.45-.34.49-1.56 1.42-2.5 2.98-2.99 0 .01.34-.08.34-.45 0 .01 0 .01 0 0zm17.06 8.46c0-.53-.44-.88-.94-1 0 0-3.96-1.34-5.43-2.25-.98-.48-1.91-1.45-2.5-2.41v.01c-.89-1.16-2.39-5.73-2.39-5.73-.18-.59-.52-.93-1.05-.94v.04L16 3.63c-.53 0-.88.44-1 .94 0 0-1.34 3.96-2.25 5.43-.48.98-1.45 1.91-2.41 2.5h.01c-1.16.89-5.73 2.39-5.73 2.39-.59.18-.93.52-.94 1.05l.06.01h-.06c0 .53.44.88.94 1 0 0 3.96 1.34 5.43 2.25.98.48 1.91 1.45 2.5 2.41v-.01c.89 1.16 2.39 5.73 2.39 5.73.18.59.52.93 1.05.94l.01-.07.01.07c.53 0 .88-.44 1-.94 0 0 1.34-3.96 2.25-5.43.48-.98 1.45-1.91 2.41-2.5h-.01c1.16-.89 5.73-2.39 5.73-2.39.59-.18.93-.52.94-1.05l-.08-.01h.07zm-.26 8.99c-.47-.24-.92-.58-1.31-.97s-.73-.85-.97-1.31c0 0-.11-.24-.39-.24s-.39.24-.39.24c-.24.47-.58.92-.97 1.31s-.85.73-1.31.97c0 0-.24.11-.24.39s.24.39.24.39c.47.24.92.58 1.31.97s.73.85.97 1.31c0 0 .11.24.39.24s.39-.24.39-.24c.24-.47.58-.92.97-1.31s.85-.73 1.31-.97c0 0 .24-.11.24-.39s-.24-.39-.24-.39z"
          style={{
            fill: `${isHovered.action1 ? 'white' : 'rgb(69, 86, 239)'}`
          }}
        ></path>
      </svg>,
      des: 'Cho bạn',
      selected: '2%',
      path: ''
    },
    {
      icon: <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action2 ? 'rgb(15, 184, 206)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action2: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action2: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.605 7.924c-.032-1.265-.746-2.4-1.784-3.113-.616-.422-1.362-.714-2.14-.714C20.67 4 18.627 4 16.584 4H13.47c-.032 0-.065.032-.097.032-1.362 0-2.724.033-4.087.065-2.043.065-3.794 1.817-3.892 3.827-.032 1.33-.097 5.74-.097 6.52 0 .745-.032 1.524 0 2.27 0 2.464.033 4.93.097 7.394.033 1.265.746 2.4 1.784 3.114.616.421 1.362.713 2.14.713C11.33 28 13.374 28 15.417 28h3.114c.032 0 .064-.032.097-.032 1.362 0 2.724-.033 4.086-.065 2.044-.065 3.795-1.816 3.892-3.827.033-1.33.033-2.692.065-4.022 0-.032.032-.097.032-.13v-2.367c0-.746.033-1.525 0-2.27 0-2.465-.032-4.898-.097-7.363Zm-15.373 7.46c.714 0 1.33.584 1.33 1.297 0 .714-.584 1.297-1.33 1.297-.713 0-1.33-.583-1.33-1.297 0-.713.584-1.297 1.33-1.297ZM9.935 12.95c0-.713.584-1.297 1.33-1.297h9.47c.746 0 1.33.584 1.33 1.297 0 .714-.584 1.298-1.33 1.298h-9.47c-.746.032-1.33-.552-1.33-1.298ZM20.832 23.46H11.135c-1.135 0-1.557-1.07-.973-1.945l1.297-1.979c.552-.875 1.979-.875 2.53 0l.616.94 2.011-3.08c.551-.876 1.978-.876 2.53 0l2.66 4.119c.583.875.129 1.945-.974 1.945Zm-.097-12.94h-9.503c-.746 0-1.33-.584-1.33-1.297 0-.714.584-1.298 1.33-1.298h9.503c.746 0 1.33.584 1.33 1.298 0 .713-.584 1.297-1.33 1.297Z"
          style={{
            fill: `${isHovered.action2 ? 'white' : 'rgb(15, 184, 206)'}`
          }}
        ></path>
      </svg>,
      des: 'Logo',
      selected: '11.5%',
      path: 'logo'
    },
    {
      icon: <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action3 ? 'rgb(33, 166, 99)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action3: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action3: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.487 6.237C25.099 4.85 22.693 4.85 18.066 4.85h-3.98c-4.719 0-7.032 0-8.513 1.48C4 7.81 4 10.125 4 14.844v2.314c0 4.72 0 7.033 1.48 8.513 1.481 1.48 3.795 1.48 8.514 1.48h3.98c4.719 0 7.032 0 8.513-1.48 1.48-1.48 1.48-3.886 1.48-8.606v-2.313c.093-4.627.093-7.126-1.48-8.514ZM12.174 23.603H8.596c-.617 0-1.08-.493-1.08-1.08v-3.577H9.8v2.406h2.406v2.252h-.03ZM24.39 10.648v2.406h-2.282v-2.406H19.7V8.366h3.609c.586 0 1.048.493 1.08 1.08v1.202Z"
          style={{
            fill: `${isHovered.action3 ? 'white' : 'rgb(33, 166, 99)'}`
          }}
        ></path>
      </svg>,
      des: 'Mạng xã hội',
      selected: '22%',
      path: 'social-media'
    },
    {
      icon: <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action4 ? 'rgb(210, 105, 230)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action4: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action4: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m25.834 10.931-2.946 2.109c-.029-.982-.029-1.993-.029-2.975-.058-1.82-1.617-3.38-3.437-3.437a204.296 204.296 0 0 0-11.899 0c-1.819.058-3.379 1.617-3.436 3.437a203.323 203.323 0 0 0 0 11.87c.057 1.82 1.617 3.38 3.436 3.437 3.957.115 7.914.115 11.9 0 1.819-.058 3.378-1.617 3.436-3.437.03-.982.03-1.993.03-2.975l2.945 2.08c1.184.837 2.166.346 2.166-1.098V12.03c-.029-1.444-.982-1.964-2.166-1.098Zm-9.386 6.354-4.65 2.686c-1.27.722-2.282.116-2.282-1.328v-5.315c0-1.444 1.04-2.05 2.282-1.328l4.679 2.686c1.241.722 1.241 1.877-.03 2.6Z"
          style={{
            fill: `${isHovered.action4 ? 'white' : 'rgb(210, 105, 230)'}`
          }}
        ></path>
      </svg>, des: 'LiveStream', selected: '34%', path: 'live-stream'
    },
    {
      icon: <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action5 ? 'rgb(165, 72, 255)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action5: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action5: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.979 13.771c-.064-2.02-1.796-3.784-3.816-3.848h-.032V7.422a.757.757 0 0 0-.225-.513l-2.533-2.534a.757.757 0 0 0-.513-.224H10.085a2.217 2.217 0 0 0-2.213 2.213v3.56H7.84c-2.02.063-3.784 1.827-3.816 3.847a285.195 285.195 0 0 0 0 7.408c.064 2.02 1.796 3.784 3.816 3.848h.032v.61c0 1.218.994 2.212 2.213 2.212h11.801a2.217 2.217 0 0 0 2.213-2.212v-.61h.032c2.02-.064 3.784-1.828 3.816-3.848.064-1.956.064-5.42.032-7.408ZM9.155 17.844c-.481-.032-.93-.449-.93-.93a16.777 16.777 0 0 1 0-1.796c.032-.48.449-.93.93-.93.61-.032 1.187-.032 1.796 0 .48.032.93.45.93.93.032.61.032 1.187 0 1.796-.032.481-.45.93-.93.93a16.81 16.81 0 0 1-1.796 0Zm12.699 7.023a.746.746 0 0 1-.738.738h-10.23a.746.746 0 0 1-.737-.738v-2.149h11.705v2.149Zm0-13.308H10.117V7.133c0-.417.353-.737.738-.737h8.08v2.886h2.887v2.277h.032Z"
          style={{
            fill: `${isHovered.action5 ? 'white' : 'rgb(165, 72, 255)'}`
          }}
        ></path>
      </svg>, des: 'Thẻ quà tặng', selected: '46%', path: 'gift'
    },
    {
      icon: <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action6 ? 'rgb(255, 81, 84)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action6: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action6: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.928 8.7c-.095-2.004-1.813-3.722-3.817-3.817-5.344-.191-10.783-.191-16.222 0-2.004.095-3.722 1.813-3.817 3.817-.096 3.435-.096 6.87 0 10.306.095 2.004 1.813 3.722 3.817 3.817 1.336 0 2.672 0 4.008.095l2.385 3.34c.955 1.336 2.481 1.336 3.436 0l2.385-3.34c1.336 0 2.672 0 4.008-.095 2.004-.095 3.722-1.813 3.817-3.817.096-3.467.096-6.903 0-10.306Zm-6.234 5.216a3.522 3.522 0 0 1-.445.923c-.287.509-1.464 2.131-4.581 4.421h-1.304c-2.418-1.78-3.658-3.149-4.23-3.912a5.85 5.85 0 0 1-.287-.382v-.032l-.032-.031a2.693 2.693 0 0 1-.477-.955 2.726 2.726 0 0 1-.16-.859c0-.19.033-.35.064-.508.128-.668.446-1.241.891-1.686a2.93 2.93 0 0 1 2.1-.86c1.208 0 2.258.732 2.735 1.75H16a3.042 3.042 0 0 1 2.736-1.75 3.054 3.054 0 0 1 3.053 3.054c.032.287-.032.573-.095.827Z"
          style={{
            fill: `${isHovered.action6 ? 'white' : 'rgb(255, 81, 84)'}`
          }}
        ></path>
      </svg>, des: 'Ưu đãi', selected: '57%', path: 'endow'
    },
    {
      icon: <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action7 ? 'rgb(87, 94, 253)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action7: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action7: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.485 6.24c-1.39-1.39-3.798-1.39-8.417-1.39h-3.983c-4.712 0-7.028 0-8.51 1.482C4 7.815 4 10.131 4 14.842v2.316c0 4.711 0 7.027 1.482 8.51 1.482 1.482 3.798 1.482 8.51 1.482h3.983c4.712 0 7.028 0 8.51-1.482 1.482-1.483 1.482-3.891 1.482-8.603V14.75c.093-4.632.093-7.12-1.482-8.51Zm-8.457 2.117c.953 0 1.76.807 1.76 1.76s-.807 1.76-1.76 1.76c-.952 0-1.76-.807-1.76-1.76-.013-.94.808-1.76 1.76-1.76Zm-4.314 0c.953 0 1.76.807 1.76 1.76s-.807 1.76-1.76 1.76-1.76-.807-1.76-1.76c0-.94.807-1.76 1.76-1.76Zm-4.301 0c.953 0 1.76.807 1.76 1.76s-.807 1.76-1.76 1.76-1.76-.807-1.76-1.76c-.014-.94.807-1.76 1.76-1.76ZM24.38 21.34a1.839 1.839 0 0 1-1.84 1.853H9.492A1.858 1.858 0 0 1 7.64 21.34v-5.545c0-1.02.834-1.853 1.853-1.853h13.036c1.02 0 1.853.834 1.853 1.853v5.545Z"
          style={{
            fill: `${isHovered.action7 ? 'white' : 'rgb(87, 94, 253)'}`
          }}
        ></path>
      </svg>, des: 'Thiệp chúc mừng', selected: '69%', path: 'congratulation'
    },
    {
      icon: <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 47,
          height: 47,
          borderRadius: "50%",
          padding: 10,
          transition: "background-color 0.3s, fill 0.3s",
          backgroundColor: `${isHovered.action8 ? 'rgb(255, 153, 0)' : 'white'}`,
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action8: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action8: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.924 8.454c-.032-1.15-.608-2.174-1.471-2.877-.672-.544-1.471-.895-2.366-.96a226.297 226.297 0 0 0-8.09-.127c-2.717 0-5.403.032-8.088.128-.864.032-1.663.383-2.334.927-.864.703-1.471 1.758-1.503 2.91a185.346 185.346 0 0 0 0 10.327c.064 2.014 1.79 3.772 3.837 3.836 1.534.064 3.037.064 4.572.064l-2.046 3.645c-.288.543.095 1.183.67 1.183h1.727a.78.78 0 0 0 .672-.384l.224-.383 1.534-2.718a.901.901 0 0 1 1.567 0l1.726 3.101c.128.256.384.384.672.384h1.726c.576 0 .96-.64.672-1.151l-.64-1.12-1.406-2.525c1.502-.032 3.037-.032 4.54-.064 2.014-.064 3.773-1.822 3.836-3.837.064-3.453.064-6.906-.031-10.359ZM15.998 18.43c-2.622 0-4.764-2.142-4.764-4.796 0-2.654 2.142-4.796 4.764-4.796v4.796h4.796a4.79 4.79 0 0 1-4.796 4.796Zm1.087-5.883V7.75c2.621 0 4.796 2.142 4.796 4.796h-4.796Z"
          style={{
            fill: `${isHovered.action8 ? 'white' : 'rgb(255, 153, 0)'}`
          }}
        ></path>
      </svg>, des: 'Sự kiện', selected: '81%', path: 'event'
    },
    {
      icon: <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
          borderRadius: "50%",
          padding: 10,
          backgroundColor: `${isHovered.action9 ? 'rgb(104, 62, 212)' : 'white'}`,
          transition: "background-color 0.3s, fill 0.3s",
        }}
        onMouseEnter={() => setIsHovered({ ...isHovered, action9: true })}
        onMouseLeave={() => setIsHovered({ ...isHovered, action9: false })}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.667 18.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Zm9.333 0a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334ZM28 16a2.667 2.667 0 1 1-5.333 0A2.667 2.667 0 0 1 28 16Z"
          style={{
            fill: `${isHovered.action9 ? 'white' : 'rgb(104, 62, 212)'}`
          }}
        ></path>
      </svg>
      , des: 'Xem thêm', selected: '91.5%', path: ''
    },
  ]

  const handleAction = (action) => {
    setArrowPosition(action.selected)
  }

  return (
    <div
      style={{
        background: 'linear-gradient(63deg, rgb(253, 208, 46) 40%, rgb(250, 226, 139) 100%)'
      }}
      className='flex flex-col items-center justify-center gap-8 p-[50px] rounded-[20px] relative overflow-hidden'>
      <div>
        <h2 className='text-white text-[2.2rem] font-bold'>Bạn muốn thiết kế gì ?</h2>
      </div>
      <div className='flex w-[700px] bg-[#ffffff] p-3 items-center gap-8 rounded-md'>
        <button className='w-[40px] h-[35px] flex items-center justify-center rounded-full hover:bg-slate-200'>
          <SearchOutlined className='text-lg' />
        </button>
        <input className='w-full appearance-none border-none focus:outline-none' type="text" placeholder='Tìm kiếm nội dung trên Ezpics' />
      </div>
      <div className='flex items-center justify-between w-full'>
        {
          actions.map((action, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-2'>
              <Link
                href={action.path}
                onClick={() => handleAction(action)}
              >
                {action.icon}
              </Link>
              <div className='text-white font-semibold'>{action.des}</div>
            </div>
          ))
        }
      </div>
      <div
        style={{
          transform:
            "matrix(-0.707107, 0.707107, -0.707107, -0.707107, 40, 2)",
          backgroundColor: "white",
          width: 16,
          height: 16,
          position: "absolute",
          bottom: 0,
          transition: "left 0.3s ease", // Smooth transition
          bottom: -6,
          left: `${arrowPosition}`,
        }}
      ></div>
    </div>
  )
}
