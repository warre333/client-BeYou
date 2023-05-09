import React from 'react'

function Steps({ step }) {
  return (
    <div className='mb-6'>
        <h2 class="sr-only">Steps</h2>

        { step === 1 && (
            <div>
                <div class="overflow-hidden rounded-full bg-gray-200">
                <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>

                <ol class="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
                    <li class="flex items-center justify-start text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Post </span>
                    </li>

                    <li class="flex items-center justify-center sm:gap-1.5">
                        <span class="hidden sm:inline"> Details </span>
                    </li>

                    <li class="flex items-center justify-end sm:gap-1.5">
                        <span class="hidden sm:inline"> Payment </span>
                    </li>
                </ol>
            </div>
        )}

        { step === 2 && (
            <div>
                <div class="overflow-hidden rounded-full bg-gray-200">
                <div class="h-2 w-1/2 rounded-full bg-blue-500"></div>
                </div>

                <ol class="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
                    <li class="flex items-center justify-start text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Post </span>
                    </li>

                    <li class="flex items-center justify-center text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Details </span>
                    </li>

                    <li class="flex items-center justify-end sm:gap-1.5">
                        <span class="hidden sm:inline"> Payment </span>
                    </li>
                </ol>
            </div>
        )}

        { step === 3 && (
            <div>
                <div class="overflow-hidden rounded-full bg-gray-200">
                <div class="h-2 w-full rounded-full bg-blue-500"></div>
                </div>

                <ol class="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
                    <li class="flex items-center justify-start text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Post </span>
                    </li>

                    <li class="flex items-center justify-center text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Details </span>
                    </li>

                    <li class="flex items-center justify-end text-blue-600 sm:gap-1.5">
                        <span class="hidden sm:inline"> Payment </span>
                    </li>
                </ol>
            </div>
        )}
    </div>
  )
}

export default Steps