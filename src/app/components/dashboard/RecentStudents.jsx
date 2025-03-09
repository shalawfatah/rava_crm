import React from 'react'
import localFont from 'next/font/local'

const rabar = localFont({ src: './rabar.ttf' })


function RecentStudents() {
  return (
    <div className={`${rabar.className} bg-[#CFE2E7] my-6 rounded-2xl p-6`}>
      <h2 className={`text-black text-3xl`}>خوێندکارانی ئەم دواییە</h2>
    </div>
  )
}

export default RecentStudents
