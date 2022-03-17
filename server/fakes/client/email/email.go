package fakes

import "sync"

type IFace struct {
	SendEmailCall struct {
		mutex     sync.Mutex
		CallCount int
		Receives  struct {
			ToName  string
			ToEmail string
		}
		Returns struct {
			Error error
		}
		Stub func(string, string) error
	}
}

func (f *IFace) SendEmail(param1 string, param2 string) error {
	f.SendEmailCall.mutex.Lock()
	defer f.SendEmailCall.mutex.Unlock()
	f.SendEmailCall.CallCount++
	f.SendEmailCall.Receives.ToName = param1
	f.SendEmailCall.Receives.ToEmail = param2
	if f.SendEmailCall.Stub != nil {
		return f.SendEmailCall.Stub(param1, param2)
	}
	return f.SendEmailCall.Returns.Error
}
