import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { ADMIN } from '../../config/api.config';

const newCookies = new Cookies();

function Analytics() {
    const [totalUsers, setTotalUsers] = useState()
    const [totalPosts, setTotalPosts] = useState()
    const [totalAdvertisements, setTotalAdvertisements] = useState()

    function getCookie(){
        if(newCookies.get('user')){
          return newCookies.get('user')
        }
    }  

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Analytics',
        },
      },
    };
    
    const date = new Date()
    const labels = [new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (6 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (6 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (6 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (5 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (5 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (5 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (4 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (4 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (4 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (3 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (3 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (3 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (2 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (2 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (2 * 24 * 60 * 60 * 1000)).getFullYear(), new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000)).getDate() + "-" + (new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000)).getMonth() + 1) + "-" + new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000)).getFullYear()];
    const data = {
      labels,
      datasets: [
        {
          label: 'Users',
          data: labels.map(() => 1),
          borderColor: 'rgb(82, 222, 229)',
          backgroundColor: 'rgba(82, 222, 229, 0.5)',
        },
        {
          label: 'Posts',
          data: labels.map(() => 1),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Advertisements',
          data: labels.map(() => 1),
          borderColor: 'rgb(242, 232, 109)',
          backgroundColor: 'rgba(242, 232, 109, 0.5)',
        },
      ],
    };
  
    function getAnalytics(){
      const cookies = getCookie()
  
      axios.get(ADMIN + "analytics",
        {
          headers: {
            "x-access-token": cookies
          },
        }
      )
        .then((response) => {
          if(response.data.success){
            setTotalUsers(response.data.data.users)
            setTotalPosts(response.data.data.posts)
            setTotalAdvertisements(response.data.data.advertisements)
          } else {
            console.log(response.data.message);        
          }
        })
    }
  
    useEffect(() => {
      getAnalytics()
    }, [])

  return (    
    <div className="w-full">
        <div className="flex flex-row mt-12">
            <div className="bg-gray-100 rounded-xl w-full mx-6 p-4">
                <p className="text-sm">Total</p>
                <p className="font-semibold text-xl">
                    {totalUsers}
                    <span className="font-normal text-base"> users</span>
                </p>
                <p className="font-semibold text-xl">
                    {totalPosts}
                    <span className="font-normal text-base"> posts</span>
                </p>
                <p className="font-semibold text-xl">
                    {totalAdvertisements}
                    <span className="font-normal text-base"> advertisements</span>
                </p>
            </div>

            <div className="bg-gray-100 rounded-xl w-full mx-6 p-4">
                <p className="text-sm">Advertisements</p>
                <p className="font-semibold text-xl">
                    $XXX.XX
                    <span className="font-normal text-base"> ad spent (today)</span>
                </p>
                <p className="font-semibold text-xl">
                    $XXX.XX
                    <span className="font-normal text-base"> average ad spent</span>
                </p>
            </div>
        </div>
        
        <div className="m-6">
            {/* <Line
            options={options}
            data={data}
            /> */}
        </div>
    </div>
  )
}

export default Analytics