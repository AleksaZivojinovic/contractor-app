import Job from '@models/Job'

export interface IJobWithSum extends Job {
	total?: number
}

export interface IJobWithEarings extends Job {
	totalEarnings?: number
	profession?: string
}
