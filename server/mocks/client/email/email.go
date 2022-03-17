package fakes

import "sync"

type IFace struct {
	SendEmailCall struct {
		mutex     sync.Mutex
		CallCount int
		Receives  struct {
			From string
			To   string
			Msg  []byte
		}
		Returns struct {
			Error error
		}
		Stub func(string, string, []byte) error
	}
}

func (f *IFace) SendEmail(param1 string, param2 string, param3 []byte) error {
	f.SendEmailCall.mutex.Lock()
	defer f.SendEmailCall.mutex.Unlock()
	f.SendEmailCall.CallCount++
	f.SendEmailCall.Receives.From = param1
	f.SendEmailCall.Receives.To = param2
	f.SendEmailCall.Receives.Msg = param3
	if f.SendEmailCall.Stub != nil {
		return f.SendEmailCall.Stub(param1, param2, param3)
	}
	return f.SendEmailCall.Returns.Error
}
